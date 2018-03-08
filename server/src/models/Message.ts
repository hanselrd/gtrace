import { Entity, Column, ManyToOne } from 'typeorm';
import BaseModel from './BaseModel';
import { User } from './';

@Entity()
export default class Message extends BaseModel {
  @Column({ type: 'text' })
  text: string;

  @Column() userId: number;

  @ManyToOne(type => User)
  user: Promise<User>;
}
