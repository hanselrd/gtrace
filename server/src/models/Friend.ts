import { Entity, Column, ManyToOne } from 'typeorm';
import BaseModel from './BaseModel';
import { User } from './';

@Entity()
export default class Friend extends BaseModel {
  @Column({ default: false })
  accepted: boolean;

  @Column() user1Id: number;

  @ManyToOne(type => User)
  user1: User;

  @Column() user2Id: number;

  @ManyToOne(type => User)
  user2: User;
}
