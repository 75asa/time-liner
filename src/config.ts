import dotenv from "dotenv";

const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}

export namespace Config {
  export namespace Slack {
    export const BOT_TOKEN: string = process.env.SLACK_BOT_TOKEN;
    export const SIGNING_SECRET: string = process.env.SLACK_SIGNING_SECRET;
    // Http Mode only
    export const PORT: number = Number(process.env.PORT) || 5000;
    // Socket Mode only
    export const APP_TOKEN: string = process.env.SLACK_APP_TOKEN;
    export const SOCKET_MODE = !!APP_TOKEN;
  }
}
