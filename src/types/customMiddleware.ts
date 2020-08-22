import { App, NextMiddleware, MessageEvent, Context } from "@slack/bolt";

export interface customMiddleware {
    message:  MessageEvent;
    app?: App
    context?: Context;
    next?: NextMiddleware;
};