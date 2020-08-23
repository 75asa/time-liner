import axios from "axios";
import { FilesUploadArguments } from "@slack/web-api";

export const getDownloadFile: any = async file => {
  return new Promise((resolve, reject) => {
    axios
        .get(file.url_private_download, {
          headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
        })
        .then(res => {
          console.log({ res });
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
  });
};

export const uploadFile = async ({ context, app, file }) => {
  return new Promise(async (resolve, reject) => {
    const fileOption: FilesUploadArguments = {
      token: context.botToken,
      channels: process.env.CHANNEL_NAME,
      file: getDownloadFile(file),
      filename: file.name,
      filetype: file.filetype,
      title: file.title || " ",
      content: file.preview
    };

    await app.files
        .upload(fileOption)
        .then(files => {
          if (files.ok) {
            console.log("file ok 😇");
            resolve(files);
          }
        })
        .catch(err => {
          console.log({ err });
          reject(err);
        });
  });
};
