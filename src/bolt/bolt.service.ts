import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, LogLevel } from '@slack/bolt';

@Injectable()
export class BoltService {
  readonly #app: App;
  constructor(private readonly config: ConfigService) {
    this.#app = new App({
      signingSecret: config.get('SLACK_SIGNING_SECRET'),
      token: config.get('SLACK_BOT_TOKEN'),
      logLevel: LogLevel.DEBUG,
    });
  }
  async invoke() {
    await this.#app.start();
    console.log('⚡️ Bolt app is running!');
  }
}
