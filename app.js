const config = require("dotenv").config().parsed;
// To clear dotenv cache
for (const k in config) {
  process.env[k] = config[k];
}
const { App, LogLevel } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// To add posted user's profile to context
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

// To response only user w/o bot
const notBotMessage = async ({ message, next }) => {
  if (!message.subtype || message.subtype !== 'bot_message') next();
  next()
};

app.use(notBotMessage)

app.message(addUsersInfoContext, /^(.*)/, async ({ context, message }) => {
  const channelInfo = await app.client.channels.info({
    token: process.env.SLACK_BOT_TOKEN,
    channel: message.channel
  })
  console.log({ channelInfo })
  context.channel = channelInfo.channel

  console.log({ context })

  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.CHANNEL_NAME,
      text: message.text,
      unfurl_links: true,
      link_names: true,
      blocks: [
        {
          "type": "context",
          "elements": [
            {
              "type": "image",
              "image_url": context.user.image_original,
              "alt_text": context.user.display_name
            },
            {
              "type": "mrkdwn",
              "text": ` *${context.user.display_name}*`
            },
            {
              "type": "mrkdwn",
              "text": `*|*`
            },
            {
              "type": "mrkdwn",
              "text": `posted on #${context.channel.name}`
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": message.text
          }
        }
      ]
    });
    console.log(`✅ ok`);
  }
  catch (error) {
    console.error(`no ${error}`);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();