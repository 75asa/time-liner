const config = require("dotenv").config().parsed;
// To clear dotenv cache
for (const k in config) {
  process.env[k] = config[k];
}
const { App, LogLevel } = require('@slack/bolt');
const express = require('express')
// const blocks = require('./src/block.js')

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// To response only user w/o bot
const notBotMessage = async ({ message, next }) => {
  if (!message.subtype || message.subtype !== 'bot_message') next();
  next()
};

// To add posted user's profile to context
const addUsersInfoContext = async ({ message, context, next }) => {
  // console.log({ message });
  const user = await app.client.users.info({
    token: context.botToken,
    user: message.user,
    include_locale: true
  });
  // console.log({ user })
  // ユーザ情報を追加
  context.tz_offset = user.tz_offset;
  context.bio = user.user
  context.user = user.user.profile;
  next()
}

const getFileInfo = async ({ message, context, next }) => {
  if (message.files) {
    const images = []
    await message.files.forEach(async (file) => {
      // console.log({ file })
      const publicFile = await app.client.files.sharedPublicURL({
        file: file.id,
        token: process.env.SLACK_OAUTH_TOKEN
      })
      console.log({ publicFile })
      let image = {
        "type": "image",
        "title": {
          "type": "plain_text",
          "text": file.name
        },
        "image_url": publicFile.file.permalink_public,
        "alt_text": file.name
      }
      // block.push(image)
      images.push(image)

    });
    context.images = images
  }
  next()
};
app.use(notBotMessage)
app.use(getFileInfo)
// app.use(addUsersInfoContext)

app.message(addUsersInfoContext, /^(.*)/, async ({ context, message }) => {
  // app.message(/^(.*)/, async ({ context, message }) => {
  const channelInfo = await app.client.channels.info({
    token: process.env.SLACK_BOT_TOKEN,
    channel: message.channel
  })
  // console.log({ channelInfo })
  context.channel = channelInfo.channel

  let block = []

  const header = {
    "type": "context",
    "elements": [
      {
        "type": "image",
        "image_url": context.user.image_original,
        "alt_text": context.user.display_name
      },
      {
        "type": "mrkdwn",
        "text": `*${context.user.display_name}*`
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
  }
  const divider = {
    "type": "divider"
  }
  const msg = {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": message.text
    }
  }
  block.push(header)
  block.push(divider)
  // 本文がある時のみmsg blockを格納
  if (message.text) block.push(msg)
  if (message.files) {
    context.images.forEach((image) => {
      block.push(image)
    })
  }

  // console.log(`|||||||||||||||||||||||||||||||||||||||`)

  // console.log({ context })
  console.log(`/////////`);
  console.log(JSON.stringify(block));
  console.log(`/////////`);
  try {
    // app.client.chat.postMessage({
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.CHANNEL_NAME,
      text: message.text,
      unfurl_links: true,
      link_names: true,
      as_user: true,
      link_names: true,
      unfurl_media: true,
      blocks: block
    });
    console.log(`✅ ok`);
  }
  catch (error) {
    console.error(`no ${error}`);
  }
});

app.action('button_click', ({ body, ack, say }) => {
  // Acknowledge the action
  ack();
  say(`<@${body.user.id}> clicked the button`);
});



(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();