import {
  BotMessageEvent,
  GenericMessageEvent,
  MessageEvent,
  MessageChangedEvent,
  MessageDeletedEvent,
  MessageRepliedEvent,
  ThreadBroadcastMessageEvent,
} from "@slack/bolt";

export const isGenericMessageEvent = (
  msg: MessageEvent
): msg is GenericMessageEvent => {
  return (msg as GenericMessageEvent).subtype === undefined;
};

export const isBotMessageEvent = (
  msg: MessageEvent
): msg is BotMessageEvent => {
  return (msg as BotMessageEvent).subtype === "bot_message";
};

export const isMessageChangedEvent = (
  msg: MessageEvent
): msg is MessageChangedEvent => {
  return (msg as MessageChangedEvent).subtype === "message_changed";
};

export const isMessageDeletedEvent = (
  msg: MessageEvent
): msg is MessageDeletedEvent => {
  return (msg as MessageDeletedEvent).subtype === "message_deleted";
};

export const isMessageRepliedEvent = (
  msg: MessageEvent
): msg is MessageRepliedEvent => {
  return (msg as MessageRepliedEvent).subtype === "message_replied";
};

export const isThreadBroadcastMessageEvent = (
  msg: MessageEvent
): msg is ThreadBroadcastMessageEvent => {
  return (msg as ThreadBroadcastMessageEvent).subtype === "thread_broadcast";
};
