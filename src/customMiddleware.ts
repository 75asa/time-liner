export const notBotMessages: any = async ({ message, next }) => {
  console.log({ message });
  // emoji event
  if (!message) await next();
  const isExistSubtype = message.subtype && message.subtype === "bot_message";
  const isExistBotID = "bot_id" in message;
  if (!isExistSubtype && !isExistBotID && !message.hidden) await next();
};

export const noThreadMessages: any = async ({ message, next }) => {
  if (!message) await next();
  if (!message.thread_ts) await next();
};

// export const noTimeline: any = async ({ message, next }) => {
//   // channel ID でTLに投稿されたのは無視する
//   if (!message.thread_ts) await next();
// };

export const getTeamInfo: any = async ({ client, context, next }) => {
  await client.team
    .info()
    .then((team) => {
      if (team.ok) {
        context.team = team.team;
      }
    })
    .catch((err) => {
      console.log({ err });
    });
  await next();
};

// To add posted user's profile to context
export const addUsersInfoContext: any = async ({
  client,
  message,
  context,
  next,
}) => {
  // emoji events
  if (!message) await next();
  await client.users
    .info({
      user: message.user,
      include_locale: true,
    })
    .then((u) => {
      if (u.ok) {
        context.tz_offset = u.user.tz_offset;
        context.user = u.user;
        context.profile = u.user.profile;
      }
    })
    .catch((err) => {
      console.log({ err });
    });

  await next();
};

export const getFileInfo: any = async ({ context, next, message }) => {
  // emoji events
  if (!message) await next();
  if (message.files) {
    context.files = await message.files.reduce(
      (acc, file, idx) => {
        console.log({ idx, file });
        // 投稿画像などは hosted にそれ以外(e.g. snippet, POST, external files)は files に
        if (file.mode === "hosted") {
          console.log({ acc });
          acc.hosted.push(file);
        } else {
          acc.files.push(file);
        }
        console.log(JSON.stringify(acc, null, 4));
        return acc;
      },
      {
        hosted: [],
        files: [],
      }
    );
  }
  await next();
};

export const getChannelInfo: any = async ({
  event,
  client,
  message,
  context,
  next,
}) => {
  await client.conversations
    .info({
      channel: message ? message.channel : event.item.channel,
    })
    .then((channel) => {
      context.channel = channel.channel;
    })
    .catch((err) => {
      console.log({ err });
    });
  await next();
};

export const enableAll: any = async (app) => {
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
