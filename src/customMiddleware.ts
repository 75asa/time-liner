// import { App } from "@slack/bolt";
import { customMiddleware } from "customMiddleware";

// To response only user w/o bot
export const notBotMessages: any = async ({ message, next }: customMiddleware) => {
  if (!message.subtype || message.subtype !== "bot_message") await next();
};

export const noThreadMessages: any = async ({ message, next }: customMiddleware) => {
  if (!message.thread_ts) return await next();
};

// To add posted user's profile to context
export const addUsersInfoContext: any = async ({ client, message, context, next }) => {
  // await app.client.users
  await client.users
    .info({
      token: context.botToken,
      user: message.user,
      include_locale: true,
    })
    .then(u => {
      if (u.ok) {
        context.tz_offset = u.user.tz_offset;
        context.user = u.user;
        context.profile = u.user.profile;
      }
    })
    .catch(err => {
      console.log({ err });
    });

  await next();
};

export const getChannelInfo: any = async ({ client, message, context, next }) => {
  // const channelInfo = await app.client.channels.info({
  const channelInfo = await client.channels.info({
    token: process.env.SLACK_BOT_TOKEN,
    channel: message.channel,
  });
  context.channel = channelInfo.channel;
  await next();
};

export const enableAll: any = async (app)=> {
  if (process.env.SLACK_REQUEST_LOG_ENABLED === "1") {
    app.use(async (args: any) => {
      const copiedArgs = JSON.parse(JSON.stringify(args));
      // console.log({copiedArgs})
      copiedArgs.context.botToken = "xoxb-***";
      if (copiedArgs.context.userToken) {
        copiedArgs.context.userToken = "xoxp-***";
      }
      // copiedArgs.client = {};
      // copiedArgs.logger = {};
      args.logger.debug(
        "Dumping request data for debugging...\n\n" +
          JSON.stringify(copiedArgs, null, 2) +
          "\n"
      );
      const result = await args.next();
      // console.log({result})
      args.logger.debug("next() call completed");
      return result;
    });
  }
};
