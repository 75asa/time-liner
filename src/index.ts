import { App, LogLevel } from "@slack/bolt";
import { ChatPostMessageArguments } from "@slack/web-api";
import dotenv from "dotenv";
import * as middleware from "./customMiddleware";
import * as blocKit from "./block";
import { SendMessageParam } from "./bolt.interface";

dotenv.config();

Object.keys(dotenv).forEach((key) => {
  process.env[key] = dotenv[key];
});

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const sendMessage: (args: SendMessageParam) => Promise<void> = async ({
  client,
  context,
  message,
}) => {
  console.log({ context });

  if ("profile" in context && "channel" in context) {
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

    await app.client.chat
      .postMessage(msgOption)
      .then((res) => {
        if (res.ok) console.log("msg: ok ✅");
      })
      .catch((err) => {
        console.error({ err });
        console.log(err.data.response_metadata);
      });

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
      await app.client.chat
        .postMessage(msgOption)
        .then((res) => {
          if (res.ok) console.log("msg: ok ✅");
        })
        .catch((err) => {
          console.error({ err });
          console.log(err.data.response_metadata);
        });

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
        await app.client.chat
          .postMessage(msgOption)
          .then((res) => {
            if (res.ok) console.log("msg: ok ✅");
          })
          .catch((err) => {
            console.error({ err });
            console.log(err.data.response_metadata);
          });
      }
    }
  }
};

(async () => {
  // Enable All Middlewares
  await middleware.enableAll(app);

  // Send Message
  app.message(sendMessage);

  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
