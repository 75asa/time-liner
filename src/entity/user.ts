import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { UsersPostEntity } from "./UsersPost";

@Entity("users")
@Index(["id"], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
  slackId: string;

  @Column({
    type: "varchar",
    length: 10,
  })
  channelId: string;

  @OneToMany(() => UsersPostEntity, (usersPost) => usersPost.user, {
    eager: true,
  })
  usersPost: UsersPostEntity[];
}
