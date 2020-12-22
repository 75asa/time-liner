import { FindAndModifyWriteOpResultObject, MongoEntityManager } from "typeorm";
import * as query from "./index";

export const users = async ({
  db,
  queryFindUser,
}: {
  db: MongoEntityManager;
  queryFindUser: query.interfaces.QueryFindUser;
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
  queryFindMessage: query.interfaces.QueryFindMessage;
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
  queryFindTimeline: query.interfaces.QueryFindTimeline;
  queryFindMessage: query.interfaces.QueryFindMessage;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "timeline",
    { ts: queryFindTimeline.ts },
    queryFindMessage,
    { upsert: true }
  );
};
