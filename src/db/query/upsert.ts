import { FindAndModifyWriteOpResultObject, MongoEntityManager } from "typeorm";
import * as query from "./inteface";

export const users = async ({
  db,
  queryFindUser,
}: {
  db: MongoEntityManager;
  queryFindUser: query.QueryFindUser;
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
  queryFindMessage: query.QueryFindMessage;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "users_posts",
    { ts: queryFindMessage.ts },
    queryFindMessage,
    { upsert: true }
  );
};

export const timeline = async ({
  db,
  queryFindTimeline,
  queryFindMessage,
}: {
  db: MongoEntityManager;
  queryFindTimeline: query.QueryFindTimeline;
  queryFindMessage: query.QueryFindMessage;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "timeline",
    { ts: queryFindTimeline.ts },
    queryFindMessage,
    { upsert: true }
  );
};
