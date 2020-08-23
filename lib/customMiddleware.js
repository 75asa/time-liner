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
exports.enableAll = exports.getChannelInfo = exports.getFileInfo = exports.addUsersInfoContext = exports.getTeamInfo = exports.noThreadMessages = exports.notBotMessages = void 0;
const axios_1 = __importDefault(require("axios"));
exports.notBotMessages = ({ message, next }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.subtype || message.subtype !== "bot_message")
        yield next();
});
exports.noThreadMessages = ({ message, next }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.thread_ts)
        yield next();
});
exports.getTeamInfo = ({ client, context, next }) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.team
        .info()
        .then(team => {
        if (team.ok) {
            context.team = team.team;
        }
    })
        .catch(err => {
        console.log({ err });
    });
    yield next();
});
// To add posted user's profile to context
exports.addUsersInfoContext = ({ client, message, context, next, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.users
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
    yield next();
});
exports.getFileInfo = ({ context, next, message }) => __awaiter(void 0, void 0, void 0, function* () {
    const getDownloadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(file.url_private_download, {
                headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
            })
                .then(res => {
                if (res.status === 200) {
                    resolve(res.data);
                }
            })
                .catch(err => {
                reject(err);
            });
        });
    });
    const addFileToContext = (file) => __awaiter(void 0, void 0, void 0, function* () {
        // return new Promise(async (resolve, reject) => {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            // const fileOption: FilesUploadArguments = {
            resolve({
                token: context.botToken,
                channels: process.env.CHANNEL_NAME,
                file: getDownloadFile(file),
                filename: file.name,
                filetype: file.filetype,
                title: file.title || " ",
                content: file.preview,
            });
        }));
    });
    if (message.files) {
        const uploadFiles = yield message.files.reduce((acc, file) => __awaiter(void 0, void 0, void 0, function* () {
            console.log({ file });
            if (file.mode === "hosted")
                return acc;
            const result = yield addFileToContext(file);
            acc.push(result);
            return acc;
        }), []);
        // 画像データ以外のfileに限定
        yield Promise.all(uploadFiles)
            .then(result => {
            context.files = result;
        })
            .catch(err => {
            console.log({ err });
        });
    }
    yield next();
});
exports.getChannelInfo = ({ client, message, context, next, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.conversations
        .info({
        channel: message.channel,
    })
        .then(channel => {
        context.channel = channel.channel;
    })
        .catch(err => {
        console.log({ err });
    });
    yield next();
});
exports.enableAll = (app) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.SLACK_REQUEST_LOG_ENABLED === "1") {
        app.use((args) => __awaiter(void 0, void 0, void 0, function* () {
            const copiedArgs = JSON.parse(JSON.stringify(args));
            // console.log({copiedArgs})
            copiedArgs.context.botToken = "xoxb-***";
            if (copiedArgs.context.userToken) {
                copiedArgs.context.userToken = "xoxp-***";
            }
            // copiedArgs.client = {};
            // copiedArgs.logger = {};
            args.logger.debug("Dumping request data for debugging...\n\n" +
                JSON.stringify(copiedArgs, null, 2) +
                "\n");
            const result = yield args.next();
            // console.log({result})
            args.logger.debug("next() call completed");
            return result;
        }));
    }
});
//# sourceMappingURL=customMiddleware.js.map