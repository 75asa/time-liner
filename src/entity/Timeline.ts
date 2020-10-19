import { KnownBlock } from '@slack/bolt';
import { Entity, Column, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UsersPostEntity } from './UsersPost';

@Entity("timeline")
@Index(["ts", "bindedChannelId"], { unique: true })
export class TimelineEntity {
  @Column()
  ts: Number;

  @Column()
  bindedChannelId: String;

  @Column()
  contents: KnownBlock[];

  @Column()
  usersPostTs: Number;

  @ManyToOne(() => UsersPostEntity, { eager: false })
  @JoinColumn({ name: "usersPostTs" })
  usersPosts: UsersPostEntity;
}