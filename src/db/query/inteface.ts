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

export interface QueryFindTimeline {
  ts: string;
  bindedChannelID: string;
  contents: string;
  usersPostID: string;
}
