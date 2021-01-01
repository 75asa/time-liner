import { ObjectID } from "mongodb";
import { Column, Entity, ObjectIdColumn, OneToMany, BaseEntity } from "typeorm";
import { UsersPostEntity } from "./UsersPost";

export interface UserConstructorArgs {
  realName: string;
  displayName: string;
  slackID: string;
}

@Entity("users")
export class UserEntity extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({
    type: "varchar",
    length: 25,
  })
  realName: string;

  @Column({
    type: "varchar",
    length: 25,
  })
  displayName: string;

  @Column({
    type: "varchar",
    length: 10,
  })
  slackID: string;

  @OneToMany(() => UsersPostEntity, (usersPost) => usersPost.user, {
    eager: true,
  })
  usersPost: UsersPostEntity[];

  constructor({ realName, displayName, slackID }: UserConstructorArgs) {
    super();
    this.realName = realName;
    this.displayName = displayName;
    this.slackID = slackID;
  }
}
