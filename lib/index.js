"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = __importDefault(require("dotenv"));
const middleware = __importStar(require("./customMiddleware"));
const blocKit = __importStar(require("./block"));
dotenv_1.default.config();
Object.keys(dotenv_1.default).forEach(key => {
    process.env[key] = dotenv_1.default[key];
});
// Initializes your app with your bot token and signing secret
const app = new bolt_1.App({
    logLevel: bolt_1.LogLevel.DEBUG,
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});
// custom middleware's
app.use(middleware.notBotMessages);
app.use(middleware.noThreadMessages);
app.use(middleware.getTeamInfo);
app.use(middleware.addUsersInfoContext);
app.use(middleware.getFileInfo);
app.message(middleware.getChannelInfo, /^(.*)/, ({ context, message }) => __awaiter(void 0, void 0, void 0, function* () {
    const msgOption = {
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.CHANNEL_NAME,
        text: message.text,
        unfurl_links: true,
        link_names: true,
        unfurl_media: true,
        icon_url: context.profile.image_original,
        username: context.profile.display_name || context.profile.real_name,
        blocks: yield blocKit.dealBlock({ context, message }),
    };
    yield app.client.chat
        .postMessage(msgOption)
        .then(res => {
        if (res.ok)
            console.log(`msg: ok ✅`);
    })
        .catch(err => {
        console.error({ err });
    });
    // console.log({ context });
    if (context.files) {
        yield Promise.all(context.files.map(file => {
            // console.log({ file });
            return app.client.files
                .upload(file)
                .then(result => {
                if (result.ok) {
                    console.log("file ok 😇");
                }
            })
                .catch(err => {
                console.log({ err });
                console.log(err.data.response_metadata);
            });
        }))
            .then(result => {
            console.log({ result });
        })
            .catch(err => {
            console.log({ err });
        });
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Start your app
    yield app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
}))();
//# sourceMappingURL=index.js.map