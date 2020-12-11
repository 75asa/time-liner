import { App } from "@slack/bolt";
import { MiddlewareParam } from "./bolt.interface";

export const notBotMessages: (args: MiddlewareParam) => Promise<void> = async ({
  message,
  next,
}: MiddlewareParam) => {
  console.log({ message });
  const isExistSubtype = message.subtype && message.subtype === "bot_message";
  const isExistBotID = "bot_id" in message;
  if (!isExistSubtype && !isExistBotID && !message.hidden) await next();
};

export const noThreadMessages: (
  args: MiddlewareParam
) => Promise<void> = async ({ message, next }: MiddlewareParam) => {
  if (!message.thread_ts) await next();
};

// export const noTimeline: any = async ({ message, next }) => {
//   // channel ID でTLに投稿されたのは無視する
//   if (!message.thread_ts) await next();
// };

export const getTeamInfo: (args: MiddlewareParam) => Promise<void> = async ({
  client,
  context,
  next,
}: MiddlewareParam): Promise<void> => {
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
export const addUsersInfoContext: (
  args: MiddlewareParam
) => Promise<void> = async ({
  client,
  message,
  context,
  next,
}: MiddlewareParam): Promise<void> => {
  await client.users
    .info({
      user: message.user,
      include_locale: true,
    })
    .then((u: any) => {
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

export const getFileInfo: (args: MiddlewareParam) => Promise<void> = async ({
  context,
  next,
  message,
}: MiddlewareParam) => {
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

export const getChannelInfo: (args: MiddlewareParam) => Promise<void> = async ({
  client,
  message,
  context,
  next,
}: MiddlewareParam): Promise<void> => {
  await client.conversations
    .info({
      channel: message.channel,
    })
    .then((channel) => {
      context.channel = channel.channel;
    })
    .catch((err) => {
      console.log({ err });
    });
  await next();
};

export const enableAll = async (app: App) => {
  if (process.env.SLACK_REQUEST_LOG_ENABLED === "1") {
    app.use(async (args) => {
      await Promise.all([
        getTeamInfo(args),
        getFileInfo(args),
        addUsersInfoContext(args),
        notBotMessages(args),
        noThreadMessages(args),
        getChannelInfo(args),
      ]);
      console.log("finished enable all");
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
