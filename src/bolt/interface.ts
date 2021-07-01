import {
  Context,
  MessageEvent,
  AllMiddlewareArgs,
  SlackEventMiddlewareArgs,
  Middleware,
  GenericMessageEvent,
} from "@slack/bolt";
import { WebClient } from "@slack/web-api";

export interface MessageEventParam {
  // message: Middleware<SlackEventMiddlewareArgs<"message">>;
  message: GenericMessageEvent;
  context: Context;
  client?: WebClient;
}
export interface MiddlewareParam extends AllMiddlewareArgs {
  message?: MessageEvent;
}
