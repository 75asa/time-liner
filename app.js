const config = require("dotenv").config().parsed;
for (const k in config) {
  process.env[k] = config[k];
}
const { App, LogLevel } = require('@slack/bolt');
const express = require('express')
const server = express()

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

server.post("/slack/events", (req, res, next) => {
  console.log(`==========> ${req}`);
  return res.status(200).json({ 'challenge': req.body.challenge });
});

const addUsersInfoContext = async ({ message, context, next }) => {
  console.log({ message });
  const user = await app.client.users.info({
    token: context.botToken,
    user: message.user,
    include_locale: true
  });

  console.log({ user })

  // ユーザ情報を追加
  context.tz_offset = user.tz_offset;
  context.bio = user.user
  context.user = user.user.profile;

  next()
}

const notBotMessage = async ({ message, next }) => {
  if (!message.subtype || message.subtype !== 'bot_message') next();
  next()
};

app.use(notBotMessage)
app.message(addUsersInfoContext, /^(.*)/, async ({ context, message }) => {
  console.log({ context })
  const user_text = context.matches[0];
  const workspace = process.env.SLACK_WORKSPACE;
  const channel = message.channel;
  const ts = message.ts.replace('.', '');
  console.log({ ts });
  // const slack_url = `https://${workspace}.slack.com/archives/${channel}/p${ts}`;
  const isIncludeLink = false;
  const checkLinkRegex = new RegExp(/^(\<.*\>)$/)

  const regexResult = message.text.match(checkLinkRegex)

  console.log({ regexResult })

  const channelInfo = await app.client.channels.info({
    token: process.env.SLACK_BOT_TOKEN,
    channel: channel
  })
  console.log({ channelInfo })

  // botやシステム投稿は無視する
  if (message.subtype) return

  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.CHANNEL_NAME,
      text: " ",
      unfurl_links: true,
      link_names: true,
      attachments: [
        {
          "color": "#FFC0CB",
          "author_name": context.user.display_name,
          "author_link": `https://app.slack.com/team/${message.user}`,
          "author_icon": context.user.image_original,
          "text": message.text,
          "footer": ``
        }
      ]
    });
    console.log(`✅ ok`);
  }
  catch (error) {
    console.error(`no ${error}`);
  }
  console.log(`> \n${user_text}`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();