import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}