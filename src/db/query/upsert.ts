import { FindAndModifyWriteOpResultObject, MongoEntityManager } from "typeorm";

export interface FindUserQuery {
  realName: string;
  displayName: string;
  slackID: string;
}

export const users = async ({
  db,
  findUserQuery,
}: {
  db: MongoEntityManager;
  findUserQuery: FindUserQuery;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "users",
    { slackID: findUserQuery.slackID },
    findUserQuery,
    {
      upsert: true,
    }
  );
};
