import { Injectable } from '@nestjs/common';
import { AnyMiddlewareArgs, Middleware } from '@slack/bolt';

@Injectable()
export class MiddlewareService {
  constructor() {}
  async ignoreBotMessage({ body, payload }: AnyMiddlewareArgs) {
    // const isExistSubtype = message.subtype && message.subtype === 'bot_message';
    // const isExistBotID = 'bot_id' in message;
    // if (!isExistSubtype && !isExistBotID && !message.hidden) await next();
  }
}
