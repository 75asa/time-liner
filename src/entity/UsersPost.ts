import { KnownBlock } from "@slack/bolt";
import {
  Entity,
  Index,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { UserEntity } from "./User";
import { TimelineEntity } from "./Timeline";

@Entity("users_posts")
@Index(["ts", "channelId"], { unique: true })
export class UsersPostEntity {
  @PrimaryColumn({
    type: "float",
  })
  ts: number;

  @PrimaryColumn({
    type: "varchar",
    length: 10,
  })
  channelId: string;

  @Column({
    type: "json",
  })
  content: KnownBlock;

  @Column({
    type: "integer",
  })
  userId: number;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @OneToMany(() => TimelineEntity, (timeline) => timeline.usersPostTs, {
    eager: true,
  })
  timelines: TimelineEntity[];
}
