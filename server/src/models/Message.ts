import { Entity, Column, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import BaseModel from './BaseModel';
import { User } from './';

@Entity()
export default class Message extends BaseModel {
  @Column({ type: 'text' })
  @Length(1, 256)
  text: string;

  @Column() userId: number;

  @ManyToOne(type => User)
  user: User;
}
