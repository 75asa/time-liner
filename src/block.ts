// typs
type DealBlockParams = {
  message: any;
  context: any;
};

type GetFileInfo = {
  message: any;
};

type GetFileInfoTemplate = any;

type GetFileInfoResult = Array<GetFileInfoTemplate>;
//

export const dealBlock = async ({ message, context }: DealBlockParams) => {
  let defautTemplate = [
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `#${context.channel.name}`
        },
        {
          type: "mrkdwn",
          text: `*|*`
        },
        {
          type: "image",
          image_url: context.user.image_original,
          alt_text: context.user.display_name
        },
        {
          type: "mrkdwn",
          text: `*${context.user.display_name}*`
        }
      ]
    },
    {
      type: "divider"
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message.text
      }
    }
  ];

  if (message.subtype === "file_share") {
    const files = await getFileInfo(message)
    files.forEach(file => {
      defautTemplate.push(file);
    });
  }
  return defautTemplate;
};

export const getFileInfo = async ({ message }: GetFileInfo) => {
  let result: GetFileInfoResult = [];
  let template: GetFileInfoTemplate = {
    type: "image",
    title: {
      type: "plain_text",
      text: "sorry, image file not found",
      image_url: "http://placekitten.com/500/500",
      alt_text: "sorry, image file not found"
    }
  };
  await message.files.forEach((element: any) => {
    template.title.text = element.name;
    template.title.image_url = element.thub_360;
    template.title.alt_text = `file: ${element.name}`;
    result.push(template);
  });
  console.log({ result });
  return result;
};
