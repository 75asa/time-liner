require('dotenv').config();
const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  channel: process.env.CHANNEL_ID
});

app.event('message', async ({ event, context }) => {
  try {
    const result = await app.client.chat.postMessage({
      token: App.token,
      channel: App.channel,
      text: `>> ${message.text}`
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// RequestURL
// https://d-tambourine-bolt-tutorial.com/slack/events
