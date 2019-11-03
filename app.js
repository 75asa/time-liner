const env = require('dotenv').config();
const { App } = require('@slack/bolt');
const util = require('util');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say(util.inspect(message));
  say(`Hey there <@${message.user}>!`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log({env})

  console.log('⚡️ Bolt app is running!');
})();

// RequestURL
// https://d-tambourine-bolt-tutorial.com/slack/events
// official: e.g.
// https://8e8ec2d7.ngrok.io/slack/events
