import { FindAndModifyWriteOpResultObject, MongoEntityManager } from "typeorm";

export interface QueryFindUser {
  realName: string;
  displayName: string;
  slackID: string;
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
