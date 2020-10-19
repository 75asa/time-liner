import { KnownBlock } from '@slack/bolt';
import { Entity, Index, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './User';
import { TimelineEntity } from './Timeline';

@Entity("users_posts")
@Index(["ts", "channelId"], { unique: true })
export class UsersPostEntity {
  @Column()
  ts: Number;

  @Column()
  channelId: String;

  @Column()
  content: KnownBlock;

  @Column()
  userId: Number;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @OneToMany(
    () => TimelineEntity,
    (timeline) => timeline.usersPostTs,
    { eager: true }
  )
  timelines: TimelineEntity[];
}