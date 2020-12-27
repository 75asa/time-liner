import { Context, MessageEvent, AllMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

export interface MessageEventParam {
  message: MessageEvent;
  context: Context;
  client?: WebClient;
}
export interface MiddlewareParam extends AllMiddlewareArgs {
  message?: MessageEvent;
}
