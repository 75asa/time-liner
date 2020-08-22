import {KnownBlock} from "@slack/types";

export const dealBlock = async ({ message }): Promise<Array<KnownBlock>> => {
// export const dealBlock = async ({ message }): Promise<KnownBlock> => {
  let defaultTemplate: Array<KnownBlock> = []
  const msg: KnownBlock = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: message.text || ' '
    },
  };
  if (message.subtype === "file_share" && message.files.length === 1) {
    console.log(message.files);
    const firstImage = message.files[0]

    msg.accessory =  {
      type: "image",
      image_url: firstImage.url_private,
      alt_text: firstImage.name
    };
  }
  defaultTemplate.push(msg);

  if (message.subtype === "file_share" && message.files.length > 1) {
    // const images: KnownBlock = await getImageBlocks({ message });
    // const images = await getImageBlocks({ message });
    message.files.forEach((image) => {
      console.log({image})
      defaultTemplate.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: image.name
        },
        accessory: {
          type: "image",
          image_url: image.url_private,
          alt_text: image.name
        }
      });
    });
  }

  return new Promise((resolve => resolve(defaultTemplate)));
};

