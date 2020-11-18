import { ObjectID } from "mongodb";
import { Column, Entity, ObjectIdColumn, OneToMany, BaseEntity } from "typeorm";
import { UsersPostEntity } from "./UsersPost";

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
}
