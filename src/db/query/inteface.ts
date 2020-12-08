export interface QueryFindUser {
  realName: string;
  displayName: string;
  slackID: string;
}

export interface QueryFindMessage {
  ts: string;
  content: string;
  userId: string;
  channelId: string;
}
