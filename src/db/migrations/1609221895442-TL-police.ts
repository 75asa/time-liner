import {
  // createConnection,
  getMongoManager,
  MigrationInterface,
  QueryRunner,
} from "typeorm";
import * as entity from "../../entity";

export class TLPolice1609221895442 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async up(_: QueryRunner): Promise<void> {
    // const connection = await createConnection();
    const manager = getMongoManager("time-liner");

    const users = [
      new entity.User.UserEntity({
        realName: "Yamda Taro",
        displayName: "YTaro",
        slackID: "GHGEOGEJE",
      }),
      new entity.User.UserEntity({
        realName: "Jenifer Lopez",
        displayName: "Jpez",
        slackID: "AAIEVVE8",
      }),
      new entity.User.UserEntity({
        realName: "Suzuki Gaku",
        displayName: "SG9",
        slackID: "GJEJVVEL",
      }),
    ];

    const resUsers = await manager.save(users);
    // const resUsers = await connection.manager.save(users);
    console.log({ resUsers });

    const usersPosts = [
      new entity.UsersPost.UsersPostEntity({
        ts: "1609473705.288900",
        userId: users[0]?.slackID,
        channelID: "GEJV83Vd",
      }),
      new entity.UsersPost.UsersPostEntity({
        ts: "1609473711.288903",
        userId: users[1]?.slackID,
        channelID: "JEJV83V8",
      }),
      new entity.UsersPost.UsersPostEntity({
        ts: "1609473749.288909",
        userId: users[2]?.slackID,
        channelID: "9E8883VA",
      }),
    ];

    const resUsersPosts = await manager.save(usersPosts);
    console.log({ resUsersPosts });

    const timelinePosts = [
      new entity.Timeline.TimelineEntity({
        ts: "39481043840289",
        binedChannelID: usersPosts[0].channelID,
        usersPostID: usersPosts[0].id,
      }),
      new entity.Timeline.TimelineEntity({
        ts: "39481043840289",
        binedChannelID: usersPosts[1].channelID,
        usersPostID: usersPosts[1].id,
      }),
      new entity.Timeline.TimelineEntity({
        ts: "39481043840289",
        binedChannelID: usersPosts[2].channelID,
        usersPostID: usersPosts[2].id,
      }),
    ];

    const resTimelinePosts = await manager.save(timelinePosts);
    console.log({ resTimelinePosts });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: ここに生クエリかく
    await queryRunner.query("");
  }
}
