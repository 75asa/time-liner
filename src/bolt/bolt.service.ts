import { Injectable } from '@nestjs/common';
import { App, LogLevel } from '@slack/bolt';
import { EnvironmentService } from '../config/environment/environment.service';
import { MiddlewareService } from './middleware/middleware.service';

@Injectable()
export class BoltService {
  readonly #app: App;
  // Initializes your app with your bot token and signing secret
  constructor(
    private readonly environmentService: EnvironmentService,
    private middlewareService: MiddlewareService,
  ) {
    this.#app = new App({
      logLevel: LogLevel.DEBUG,
      token: this.environmentService.SlackBotToken,
      socketMode: true,
      appToken: this.environmentService.SlackAppToken,
      signingSecret: this.environmentService.SlackSigningSecret,
    });

    this.#initBolt();
  }

  async #initBolt() {
    await this.#app.start();
    console.log('⚡️ Bolt app is running!');
  }

  async #enableAllMiddleware() {
    return await this.middlewareService.enableAllMiddleware(this.#app);
  }
}
