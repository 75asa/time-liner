const env = require('dotenv').config();
const { App } = require('@slack/bolt');
const util = require('util');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// app.post("/slack/events", (req, res) => {
//   return res.status(200).json({ 'challenge': req.body.challenge });
// });

// Listens to incoming messages that contain "hello"
app.message('hello', ({ message, say }) => {
  // console.log({ message })
  // say('hoge')
  say(`おっっす <@${message.user}>`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// RequestURL
// https://d-tambourine-bolt-tutorial.com/slack/events
// official: e.g.
// https://8e8ec2d7.ngrok.io/slack/events
