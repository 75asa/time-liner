import { Context, MessageEvent } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

export interface MessageEventParam {
  message: MessageEvent;
  context: Context;
  client?: WebClient;
}
