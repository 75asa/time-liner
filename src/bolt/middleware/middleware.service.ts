import { Injectable } from '@nestjs/common';
import { App, Context, MessageEvent, NextFn } from '@slack/bolt';
import { WebClient } from '@slack/web-api';

export interface MessageEventParam {
  message: MessageEvent;
  context: Context;
  client?: WebClient;
}

export interface MiddlewareParam {
  next: NextFn;
  client?: WebClient;
  message?: MessageEvent;
  context?: Context;
}

@Injectable()
export class MiddlewareService {
  constructor() {}
  async enableAllMiddleware(app: App) {
    app.use(this.noBotMessages);
  }
  async noBotMessages({ message, next }: MiddlewareParam) {
    console.log({ message });
    const isExistSubtype = message.subtype && message.subtype === 'bot_message';
    const isExistBotID = 'bot_id' in message;
    // if (!isExistSubtype && !isExistBotID && !message.hidden) await next();
    if (!isExistSubtype && !isExistBotID) await next();
  }
}
