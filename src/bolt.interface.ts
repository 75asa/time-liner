import { Context, MessageEvent, NextFn } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

export interface MessageEventParam {
  message: MessageEvent;
  context: Context;
  client?: WebClient;
}

export interface MiddlewareParam {
  next?: NextFn;
  client?: WebClient;
  message?: MessageEvent;
  context?: Context;
}
