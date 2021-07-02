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

  export namespace DB {
    export const TYPE: string = process.env.DB_TYPE;
    export const NAME: string = process.env.DB_NAME;
    export const HOST: string = process.env.DB_HOST;
    export const PORT: string = process.env.DB_PORT;
    export const USER: string = process.env.DB_USER;
    export const PASS: string = process.env.DB_PASS;
  }
}
