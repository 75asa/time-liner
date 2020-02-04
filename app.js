const port = 3333
const config = require("dotenv").config().parsed;
for (const k in config) {
  process.env[k] = config[k];
}
const { App } = require('@slack/bolt');
const { LogLevel } = require("@slack/logger");
const express = require('express')
const server = express()

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  channel: process.env.CHANNEL_ID
});

server.post("/slack/events", (req, res, next) => {
  return res.status(200).json({ 'challenge': req.body.challenge });
});

app.message(/^(.*)/, async ({ context, message }) => {
  console.log({ context });
  console.log({ message });
  const user_text = context.matches[0];
  const workspace = process.env.SLACK_WORKSPACE;
  const channel = message.channel;
  const ts = message.ts.replace('.', '');
  console.log({ ts });
  const slack_url = `https://${workspace}.slack.com/archives/${channel}/p${ts}`;

  // botやシステム投稿は無視する
  if (message.subtype) return

  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_OAUTH_TOKEN,
      channel: process.env.CHANNEL_NAME,
      text: slack_url,
      unfurl_links: true
    });
    console.log(`ok ${result}`);
  }
  catch (error) {
    console.error(`no ${error}`);
  }
  console.log(`> \n${user_text}`);
});

(async () => {
  // Start your app
  // await app.start(process.env.PORT || port);
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();