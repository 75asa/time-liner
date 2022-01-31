import { Injectable } from '@nestjs/common';
import { App, LogLevel } from '@slack/bolt';

@Injectable()
export class BoltService {
  #app: App;
  // Initializes your app with your bot token and signing secret
  constructor() {
    this.#app = new App({
      logLevel: LogLevel.DEBUG,
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    });
  }

  async #extend() {
    this.#app.message(async ({ client, context, message }) => {
      console.log({ client, context, message });
    });
  }

  async run() {
    await this.#app.start(Number(process.env.PORT) || 3000);
    console.log('⚡️ Bolt app is running!');
    await this.#extend();
  }
}
