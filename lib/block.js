"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealBlock = void 0;
const getPostedURL = ({ context, message }) => {
    return `<https://${context.team.name}.slack.com/archives/${message.channel}/p${message.ts.replace(".", "")}|詳しくみる>`;
};
exports.dealBlock = ({ context, message, }) => __awaiter(void 0, void 0, void 0, function* () {
    const divider = {
        type: "divider",
    };
    const files = message.files;
    console.log({ files });
    let defaultTemplate = [];
    const msg = {
        type: "section",
        text: {
            type: "mrkdwn",
            text: message.text || " ",
        },
    };
    console.log({ message });
    if (message.subtype === "file_share" &&
        message.files.length === 1 &&
        message.files[0].mode === "hosted") {
        const firstImage = message.files[0];
        msg.accessory = {
            type: "image",
            image_url: firstImage.url_private,
            alt_text: firstImage.name,
        };
    }
    const header = {
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
    console.log({ header, divider, msg });
    defaultTemplate.push(header);
    defaultTemplate.push(divider);
    defaultTemplate.push(msg);
    if (message.subtype === "file_share" &&
        message.files.length > 1 &&
        message.files.some(file => { return file.mode === "hosted"; })) {
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
    console.log({ defaultTemplate });
    return new Promise(resolve => resolve(defaultTemplate));
});
//# sourceMappingURL=block.js.map