import { KnownBlock } from "@slack/bolt";
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ObjectIdColumn,
  BaseEntity,
} from "typeorm";
import { UserEntity } from "./User";
import { TimelineEntity } from "./Timeline";
import { ObjectID, ObjectId } from "mongodb";

@Entity("users_posts")
export class UsersPostEntity extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    type: "varchar",
    length: 25,
  })
  ts: number;

  @Column({
    type: "json",
  })
  content: KnownBlock;

  @Column({
    type: "string",
  })
  userId: ObjectID;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @OneToMany(() => TimelineEntity, (timeline) => timeline.usersPostID, {
    eager: true,
  })
  timelines: TimelineEntity[];
}
