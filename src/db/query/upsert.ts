import { FindAndModifyWriteOpResultObject, MongoEntityManager } from "typeorm";

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

export const users = async ({
  db,
  queryFindUser,
}: {
  db: MongoEntityManager;
  queryFindUser: QueryFindUser;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "users",
    { slackID: queryFindUser.slackID },
    queryFindUser,
    {
      upsert: true,
    }
  );
};

export const usersPosts = async ({
  db,
  queryFindMessage,
}: {
  db: MongoEntityManager;
  queryFindMessage: QueryFindMessage;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "users_posts",
    { ts: queryFindMessage.ts },
    queryFindMessage,
    { upsert: true }
  );
};
