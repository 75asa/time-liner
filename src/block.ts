import { KnownBlock } from "@slack/types";

const getPostedURL = ({ context, message }): string => {
  return `<https://${context.team.name}.slack.com/archives/${
    message.channel
  }/p${message.ts.replace(".", "")}|詳しくみる>`;
};

export const dealBlock = async ({
  context,
  message,
}): Promise<Array<KnownBlock>> => {
  const divider: KnownBlock = {
    type: "divider",
  };

  const files = message.files;

  let defaultTemplate: Array<KnownBlock> = [];
  const msg: KnownBlock = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: message.text || " ",
    },
  };
  if (
    message.subtype === "file_share" &&
    message.files.length === 1 &&
    message.files[0].mode === "hosted"
  ) {
    const firstImage = message.files[0];

    msg.accessory = {
      type: "image",
      image_url: firstImage.url_private,
      alt_text: firstImage.name,
    };
  }
  const header: KnownBlock = {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `投稿先   #${context.channel.name}`,
      },
      {
        type: "mrkdwn",
        text: `*|*`,
      },
      {
        type: "mrkdwn",
        text: `*${getPostedURL({
          context,
          message,
        })}*`,
      },
    ],
  };

  defaultTemplate.push(header);
  defaultTemplate.push(divider);
  defaultTemplate.push(msg);

  if (
    message.subtype === "file_share" &&
    message.files.length > 1 &&
    message.files.some(file => { return file.mode === "hosted" })
  ) {
    message.files.forEach(image => {
      defaultTemplate.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: image.name,
        },
        accessory: {
          type: "image",
          image_url: image.url_private,
          alt_text: image.name,
        },
      });
    });
  }
  console.log(JSON.stringify(defaultTemplate))

  return new Promise(resolve => resolve(defaultTemplate));
};
