import { App, LogLevel } from "@slack/bolt";
import { ChatPostMessageArguments } from "@slack/web-api";
import dotenv from "dotenv";
import * as middleware from "./customMiddleware";
import * as blocKit from "./block";
import { createConnection, MongoEntityManager, Connection } from "typeorm";

dotenv.config();

Object.keys(dotenv).forEach((key) => {
  process.env[key] = dotenv[key];
});

let connection: Connection;
let mongoEntityMgr: MongoEntityManager;

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// custom middleware's
app.use(middleware.notBotMessages);
app.use(middleware.noThreadMessages);
app.use(middleware.getTeamInfo);
app.use(middleware.addUsersInfoContext);
app.use(middleware.getFileInfo);

app.message(
  middleware.getChannelInfo,
  /^(.*)/ as any,
  async ({ client, context, message }) => {
    const msgOption: ChatPostMessageArguments = {
      token: client.token,
      channel: process.env.CHANNEL_NAME,
      text: message.text,
      unfurl_links: true,
      link_names: true,
      unfurl_media: true,
      icon_url: context.profile.image_original,
      username: context.profile.display_name || context.profile.real_name,
      blocks: await blocKit.dealBlock({ context, message }),
    };

    console.log("1回目", JSON.stringify(msgOption, null, 4));

    // const user = new UserEntity();
    // user.realName = context.profile.real_name;
    // user.displayName = context.profile.display_name;
    // user.slackID = context.channel.creator;

    const findUser = {
      realName: context.profile.real_name,
      displayName: context.profile.display_name,
      slackID: context.channel.creator,
    };
    const insertedUser = await mongoEntityMgr.findOneAndReplace(
      "users",
      { slackID: findUser.slackID },
      findUser,
      { upsert: true }
    );

    const findMessage = {
      ts: message.ts,
      content: message.text,
      userId: insertedUser.value._id,
      channelId: message.channel,
    };
    const insertedMessage = await mongoEntityMgr.findOneAndReplace(
      "users_posts",
      { ts: findMessage.ts },
      findMessage,
      { upsert: true }
    );

    const postTLRes = await app.client.chat
      .postMessage(msgOption)
      .catch((err) => {
        console.error({ err });
        console.log(err.data.response_metadata);
        return { ok: false, ts: null, channel: null, message: null };
      });

    if (postTLRes.ok) {
      console.log("msg: ok ✅");

      const findTL = {
        ts: postTLRes.ts,
        bindedChannelID: postTLRes.channel,
        contents: postTLRes.message.blocks,
        usersPostID: insertedMessage.lastErrorObject.upserted,
      };
      const insertedTLRes = await mongoEntityMgr.findOneAndReplace(
        "timeline",
        { ts: findTL.ts },
        findMessage,
        { upsert: true }
      );
      console.log(insertedTLRes);
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

      const postfileTLRes = await app.client.chat
        .postMessage(msgOption)
        .catch((err) => {
          console.error({ err });
          console.log(err.data.response_metadata);
          return { ok: false };
        });
      if (postfileTLRes.ok) console.log("msg: ok ✅");
    }
  }
);

app.event("member_joined_channel", async () => {
  console.log("hoge");
});

(async () => {
  connection = await createConnection();
  mongoEntityMgr = new MongoEntityManager(connection);

  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
