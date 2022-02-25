import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnvEnum } from '../constant';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {
    // console.dir(this.configService, { depth: null });
  }

  isProduction(): boolean {
    return this.configService.get('NODE_ENV') === NodeEnvEnum.PRODUCTION;
  }

  get service() {
    return this.configService;
  }

  get NodeEnv(): string {
    return this.configService.get('NODE_ENV');
  }

  get Port(): number {
    return this.configService.get('PORT');
  }

  get SlackBotToken(): string {
    return this.configService.get('SLACK_BOT_TOKEN');
  }

  get SlackAppToken(): string {
    return this.configService.get('SLACK_APP_TOKEN');
  }

  get SlackSigningSecret(): string {
    return this.configService.get('SLACK_SIGNING_SECRET');
  }

  get SlackChannelName(): string {
    return this.configService.get('SLACK_CHANNEL_NAME');
  }

  get SlackRequestLogEnabled(): boolean {
    return this.configService.get('SLACK_REQUEST_LOG_ENABLED');
  }
}
