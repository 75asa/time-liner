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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bolt_1 = require("@slack/bolt");
const request_1 = __importDefault(require("request"));
const dotenv = require("dotenv");
// const config = require("dotenv").config().parsed;
// To clear dotenv cache
for (const k in dotenv.config().parsed) {
    process.env[k] = dotenv[k];
}
//
// Initializes your app with your bot token and signing secret
const app = new bolt_1.App({
    logLevel: bolt_1.LogLevel.DEBUG,
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});
// To response only user w/o bot
const notBotMessages = ({ message, next }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.subtype || message.subtype !== "bot_message")
        next();
});
const noThreadMessages = ({ message, next }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.thread_ts)
        next();
});
// To add posted user's profile to context
const addUsersInfoContext = ({ message, context, next }) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ message });
    const user = yield app.client.users.info({
        token: context.botToken,
        user: message.user,
        include_locale: true
    });
    // console.log({ user })
    // ユーザ情報を追加
    const u = user.user;
    context.tz_offset = user.tz_offset;
    context.bio = u;
    context.user = u.profile;
    next();
});
const getChannelInfo = ({ message, context, next }) => __awaiter(void 0, void 0, void 0, function* () {
    const channelInfo = yield app.client.channels.info({
        token: process.env.SLACK_BOT_TOKEN,
        channel: message.channel
    });
    // console.log({ channelInfo })
    context.channel = channelInfo.channel;
    next();
});
const getFileInfo = ({ message }) => __awaiter(void 0, void 0, void 0, function* () {
    yield message.files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        console.log({ file });
        const fileBuffer = yield new Promise((resolve, reject) => {
            request_1.default({
                method: "get",
                url: file.url_private_download,
                encoding: null,
                headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` }
            }, (error, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    console.log({ body });
                    resolve(body);
                }
            });
        });
        yield app.client.files.upload({
            channels: process.env.CHANNEL_NAME,
            file: fileBuffer,
            filename: file.name,
            token: process.env.SLACK_BOT_TOKEN
        });
    }));
});
app.use(notBotMessages);
app.use(noThreadMessages);
app.use(getChannelInfo);
app.use(addUsersInfoContext);
app.message(addUsersInfoContext, /^(.*)/, ({ context, message }) => __awaiter(void 0, void 0, void 0, function* () {
    let block = [];
    const header = {
        type: "context",
        elements: [
            {
                type: "image",
                image_url: context.user.image_original,
                alt_text: context.user.display_name
            },
            {
                type: "mrkdwn",
                text: `*${context.user.display_name}*`
            },
            {
                type: "mrkdwn",
                text: `*|*`
            },
            {
                type: "mrkdwn",
                text: `posted on #${context.channel.name}`
            }
        ]
    };
    const divider = {
        type: "divider"
    };
    let msg = {
        type: "section",
        text: {
            type: "mrkdwn",
            text: message.text
        }
    };
    block.push(header);
    block.push(divider);
    // 本文がある時のみmsg blockを格納
    if (message.text)
        block.push(msg);
    console.log(`/////////`);
    console.log(JSON.stringify(block));
    console.log(`/////////`);
    // console.log({ context })
    try {
        yield app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: process.env.CHANNEL_NAME,
            text: message.text,
            unfurl_links: true,
            link_names: true,
            as_user: true,
            unfurl_media: true,
            blocks: block
        });
        console.log(`msg: ok ✅`);
        // ファイルがある場合は送信
        if (message.files) {
            getFileInfo({ message });
            console.log(`file: ok ✅`);
        }
    }
    catch (error) {
        console.error(`no ${error}`);
    }
}));
app.action("button_click", ({ body, ack, say }) => {
    // Acknowledge the action
    ack();
    say(`<@${body.user.id}> clicked the button`);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Start your app
    yield app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
}))();
//# sourceMappingURL=index.js.map