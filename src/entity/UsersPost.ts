import { KnownBlock } from '@slack/bolt';
import { Entity, Index, Column, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './User';

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
  @JoinColumn()
  user: UserEntity;
}