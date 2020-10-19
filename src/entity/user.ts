import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersPostEntity } from './UsersPost';

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  realName: String;

  @Column()
  displayName: String;

  @Column()
  slackId: String;

  @Column()
  channelId: String;

  @OneToMany(
    () => UsersPostEntity,
    (usersPost) => usersPost.user,
    { eager: true }
  )
  usersPost: UsersPostEntity[];
}