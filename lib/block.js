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
//
exports.dealBlock = ({ message, context }) => __awaiter(void 0, void 0, void 0, function* () {
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
        const files = yield exports.getFileInfo(message);
        files.forEach(file => {
            defautTemplate.push(file);
        });
    }
    return defautTemplate;
});
exports.getFileInfo = ({ message }) => __awaiter(void 0, void 0, void 0, function* () {
    let result = [];
    let template = {
        type: "image",
        title: {
            type: "plain_text",
            text: "sorry, image file not found",
            image_url: "http://placekitten.com/500/500",
            alt_text: "sorry, image file not found"
        }
    };
    yield message.files.forEach((element) => {
        template.title.text = element.name;
        template.title.image_url = element.thub_360;
        template.title.alt_text = `file: ${element.name}`;
        result.push(template);
    });
    console.log({ result });
    return result;
});
//# sourceMappingURL=block.js.map