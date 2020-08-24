import axios from "axios";

export const notBotMessages: any = async ({ message, next }) => {
  console.log({message})
  if (!message.subtype || message.subtype !== "bot_message") await next();
};

export const noThreadMessages: any = async ({ message, next }) => {
  if (!message.thread_ts) await next();
};

export const getTeamInfo: any = async ({ client, context, next }) => {
  await client.team
    .info()
    .then(team => {
      if (team.ok) {
        context.team = team.team;
      }
    })
    .catch(err => {
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
  await client.users
    .info({
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

export const getFileInfo: any = async ({ context, next, message }) => {
  const getDownloadFile: any = async file => {
    return new Promise((resolve, reject) => {
      axios
        .get(file.url_private_download, {
            headers: { Authorization: `Bearer ${context.botToken}`},
            responseType: 'arraybuffer',
        })
        .then(res => {
          if (res.status === 200) {
            console.log({res});
            resolve(res.data);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  const addFileToContext = async file => {
    // return new Promise(async (resolve, reject) => {
    return new Promise(async resolve => {
      // const fileOption: FilesUploadArguments = {
      resolve({
        token: context.botToken,
        channels: process.env.CHANNEL_NAME,
        filename: file.name,
        filetype: file.filetype,
        title: file.title || " ",
        content: getDownloadFile(file),
      });
    });
  };

  if (message.files) {
    const uploadFiles = await message.files.reduce(async (acc, file) => {
      console.log({ file });
      if (file.mode === "hosted") return acc;
      const result = await addFileToContext(file);
      acc.push(result);
      return acc;
    }, []);
    // 画像データ以外のfileに限定
    await Promise.all(uploadFiles)
      .then(result => {
        context.files = result;
      })
      .catch(err => {
        console.log({ err });
      });
  }

  await next();
};

export const getChannelInfo: any = async ({
  client,
  message,
  context,
  next,
}) => {
  await client.conversations
    .info({
      channel: message.channel,
    })
    .then(channel => {
      context.channel = channel.channel;
    })
    .catch(err => {
      console.log({ err });
    });
  await next();
};

export const enableAll: any = async app => {
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
