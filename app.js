const config = require("dotenv").config().parsed;
// To clear dotenv cache
for (const k in config) {
  process.env[k] = config[k];
}
const { App, LogLevel } = require('@slack/bolt');
const request = require('request')

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// To response only user w/o bot
const notBotMessages = async ({ logger, message, next }) => {
  // console.log({ message })
  logger.info({ message })
  if (!message.subtype || message.subtype !== 'bot_message') next();
};

const noThreadMessages = async ({ message, next }) => {
  if (!message.thread_ts) next();
}

// To add posted user's profile to context
const addUsersInfoContext = async ({ client, message, context, next }) => {
  const user = await client.users.info({
    user: message.user,
    include_locale: true
  });
  if (user.ok) {
    // ユーザ情報を追加
    context.tz_offset = user.tz_offset;
    context.bio = user.user
    context.user = user.user.profile;
    next()
  } else {
    logger.error(`Failed to get detailed user info for an incoming message ${user.error}`);
  }
}

const getChannelInfo = async ({ client, message, context, next }) => {
  const channelInfo = await client.channels.info({
    channel: message.channel
  })
  if (channelInfo.ok) {
    context.channel = channelInfo.channel
    next()
  } else {
    logger.error(`Failed to get detailed user info for an incoming message ${channelInfo.error}`);
  }
}

const getFileInfo = async ({ client, logger, message }) => {
  await message.files.forEach(async (file) => {
    logger.info({ file })
    const fileBuffer = await new Promise((resolve, reject) => {
      request({
        method: 'get',
        url: file.url_private_download,
        encoding: null,
        headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` }
      }, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          logger.info({ body })
          resolve(body);
        }
      })
    });
    await client.files.upload({
      channels: process.env.CHANNEL_NAME,
      file: fileBuffer,
      filename: file.name
    });
  });
};

app.use(notBotMessages)
app.use(noThreadMessages)
app.use(getChannelInfo)
app.use(addUsersInfoContext)

app.message(addUsersInfoContext, /^(.*)/, async ({ client, logger, context, message }) => {

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
  let msg = {
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

  console.log(`/////////\n${JSON.stringify(block)}\n/////////`);
  try {
    const res = await client.chat.postMessage({
      channel: process.env.CHANNEL_NAME,
      text: message.text,
      unfurl_links: true,
      link_names: true,
      as_user: true,
      link_names: true,
      unfurl_media: true,
      blocks: block
    });
    if (res.ok) {
      console.log(`msg: ok ✅`);
    } else {
      logger.error(`Failed to post a message (error: ${res.error})`);
    }

    // ファイルがある場合は送信
    if (message.files) {
      getFileInfo({ client, logger, message })
      logger.info(`file: ok ✅`);
    }
  }
  catch (error) {
    logger.error(`no ${error}`);
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