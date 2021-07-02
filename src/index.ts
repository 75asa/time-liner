import { App, AppOptions, LogLevel } from "@slack/bolt";
import { ChatPostMessageArguments } from "@slack/web-api";
import { createConnection, MongoEntityManager, Connection } from "typeorm";
import * as bolt from "./bolt";
import { Config } from "./config";
import * as query from "./db/query";

let connection: Connection;
let db: MongoEntityManager;

// Initializes your app with your bot token and signing secret
const appOption: AppOptions = {
  logLevel: LogLevel.DEBUG,
  token: Config.Slack.BOT_TOKEN,
  signingSecret: Config.Slack.SIGNING_SECRET,
};
// Socket mode
if (Config.Slack.SOCKET_MODE) {
  appOption.socketMode = true;
  appOption.appToken = Config.Slack.APP_TOKEN;
}
const app = new App(appOption);

// custom middleware
app.use(bolt.customMiddleware.ignoreBotMessages);
app.use(bolt.customMiddleware.ignoreThreadMessages);
app.use(bolt.customMiddleware.getTeamInfo);
app.use(bolt.customMiddleware.addUsersInfoContext);
app.use(bolt.customMiddleware.getFileInfo);

app.message(
  bolt.customMiddleware.getChannelInfo,
  async ({ client, context, message }) => {
    if (!bolt.events.isGenericMessageEvent(message)) return;
    const msgOption: ChatPostMessageArguments = {
      token: client.token,
      channel: process.env.CHANNEL_NAME,
      text: message.text,
      unfurl_links: true,
      link_names: true,
      unfurl_media: true,
      icon_url: context.profile.image_original,
      username: context.profile.display_name || context.profile.real_name,
      blocks: await bolt.blocks.dealBlock({ context, message }),
    };

    console.log("1回目", JSON.stringify(msgOption, null, 4));

    const queryFindUser: query.interfaces.QueryFindUser = {
      realName: context.profile.real_name as string,
      displayName: context.profile.display_name as string,
      slackID: context.channel.creator as string,
    };
    const resInsertedUser = await query.upserts.users({
      db,
      queryFindUser,
    });

    const queryFindMessage: query.interfaces.QueryFindMessage = {
      ts: message.ts,
      content: message.text,
      userId: resInsertedUser.value._id as string,
      channelId: message.channel,
    };
    const resInsertedUsersPosts = await query.upserts.usersPosts({
      db,
      queryFindMessage,
    });

    const resPostTL = await app.client.chat
      .postMessage(msgOption)
      .catch((err) => {
        console.error({ err });
        console.log(err.data.response_metadata);
        return { ok: false, ts: null, channel: null, message: null };
      });

    if (resPostTL.ok) {
      console.log("msg: ok ✅");

      const queryFindTimeline: query.interfaces.QueryFindTimeline = {
        ts: resPostTL.ts,
        boundedChannelID: resPostTL.channel as string,
        contents: resPostTL.message.blocks as string,
        usersPostID: resInsertedUsersPosts.lastErrorObject.upserted as string,
      };
      const resInsertedTL = await query.upserts.timeline({
        db,
        queryFindMessage,
        queryFindTimeline,
      });
      console.log({ resInsertedTL });
    }

    console.log(JSON.stringify(context.files, null, 4));

    if (context.files && context.files.files.length) {
      // snippet, POST がある場合は blocks があると送信できないので本文投稿後に再度ファイルだけ投稿
      // icon_url, usernameもpayloadに存在するとattachmentの展開がされないので削除
      delete msgOption.blocks;
      delete msgOption.icon_url;
      delete msgOption.username;
      await Promise.all(
        context.files.files.map(async (file) => {
          return await new Promise<string>((resolve, reject) => {
            if (file.permalink) {
              resolve(file.permalink);
            } else {
              reject("error");
            }
          });
        })
      )
        .then(async (result) => {
          // console.log({ result });
          await result.forEach((value) => {
            msgOption.text = value as string;
          });
        })
        .catch((e) => {
          console.log({ e });
        });

      console.log("2回目", JSON.stringify(msgOption, null, 4));

      const resPostFileTL = await app.client.chat
        .postMessage(msgOption)
        .catch((err) => {
          console.error({ err });
          console.log(err.data.response_metadata);
          return { ok: false };
        });
      if (resPostFileTL.ok) console.log("msg: ok ✅");
    }
  }
);

app.event("member_joined_channel", async () => {
  console.log("hoge");
});

(async () => {
  connection = await createConnection();
  db = new MongoEntityManager(connection);

  // Start your app
  await app.start(Config.Slack.SOCKET_MODE ? null : Config.Slack.PORT);

  console.log(
    `⚡️ Bolt app is running! on ${
      Config.Slack.SOCKET_MODE ? "Socket Mode" : Config.Slack.PORT
    }`
  );
})();
