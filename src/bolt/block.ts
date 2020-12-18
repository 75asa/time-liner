import { KnownBlock } from "@slack/types";
import { MessageEventParam } from "./interface";

const getPostedURL = ({ context, message }: MessageEventParam): string => {
  return `<https://${context.team.name}.slack.com/archives/${
    message.channel
  }/p${message.ts.replace(".", "")}|詳しくみる>`;
};

export const dealBlock = async ({
  context,
  message,
}: MessageEventParam): Promise<Array<KnownBlock>> => {
  const defaultTemplate: Array<KnownBlock> = [];

  const header: KnownBlock = {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `投稿先   #${context.channel.name}`,
      },
      {
        type: "mrkdwn",
        text: "*|*",
      },
      {
        type: "mrkdwn",
        text: `*${getPostedURL({ context, message })}*`,
      },
    ],
  };

  const divider: KnownBlock = {
    type: "divider",
  };

  const msg: KnownBlock = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: message.text || " ",
    },
  };

  // 投稿された画像が一枚だけの場合はメッセージと画像をつなげて block にする
  if (context.files && context.files.hosted.length === 1) {
    const firstImage = message.files[0];

    msg.accessory = {
      type: "image",
      image_url: firstImage.url_private,
      alt_text: firstImage.name,
    };
  }

  defaultTemplate.push(header);
  defaultTemplate.push(divider);
  defaultTemplate.push(msg);

  // 複数の画像がある場合 blocks の images で投稿
  if (context.files && context.files.hosted.length > 1) {
    message.files.forEach((image) => {
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

  // console.log('blocks', JSON.stringify(defaultTemplate, null, 4));
  // console.log({defaultTemplate})
  // console.log(JSON.stringify(msg, null, 4))

  return new Promise((resolve) => resolve(defaultTemplate));
};
