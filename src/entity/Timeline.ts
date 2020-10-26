import { KnownBlock } from "@slack/bolt";
import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { UsersPostEntity } from "./UsersPost";

@Entity("timeline")
@Index(["ts", "bindedChannelID"], { unique: true })
export class TimelineEntity {
  @PrimaryColumn({
    type: "varchar",
    length: 25,
  })
  ts: string;

  @PrimaryColumn({
    type: "varchar",
    length: 10,
  })
  bindedChannelID: string;

  @Column({
    type: "json",
  })
  contents: KnownBlock[];

  @Column({
    type: "varchar",
    length: 25,
  })
  usersPostTs: string;

  @ManyToOne(() => UsersPostEntity, { eager: false })
  @JoinColumn({ name: "usersPostTs" })
  usersPosts: UsersPostEntity;
}
