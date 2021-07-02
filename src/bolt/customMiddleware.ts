import { WebAPICallResult } from "@slack/web-api";
import * as types from "./interface";
import * as events from "./messageEvents";

export const ignoreBotMessages = async ({
  message,
  next,
}: types.MiddlewareParam): Promise<void> => {
  if (!events.isBotMessageEvent(message)) await next();
};

export const ignoreThreadMessages = async ({
  message,
  next,
}: types.MiddlewareParam): Promise<void> => {
  if (events.isThreadBroadcastMessageEvent(message)) await next();
  if (!events.isMessageRepliedEvent(message)) await next();
};

export const getTeamInfo = async ({
  client,
  context,
  next,
}: types.MiddlewareParam): Promise<void> => {
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
export const addUsersInfoContext = async ({
  client,
  message,
  context,
  next,
}: types.MiddlewareParam): Promise<void> => {
  if (!events.isGenericMessageEvent(message)) return;
  await client.users
    .info({
      user: message.user,
      include_locale: true,
    })
    .then((u: WebAPICallResult) => {
      if (u.ok) {
        context.tz_offset = u.user["tz_offset"];
        context.user = u.user;
        context.profile = u.user["profile"];
        console.log({ context });
      }
    })
    .catch((err) => {
      console.log({ err });
    });

  await next();
};

export const getFileInfo = async ({
  context,
  next,
  message,
}: types.MiddlewareParam): Promise<void> => {
  if (!events.isGenericMessageEvent(message)) return;
  if (message.files) {
    context.files = message.files.reduce(
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

export const getChannelInfo = async ({
  client,
  message,
  context,
  next,
}: types.MiddlewareParam): Promise<void> => {
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
