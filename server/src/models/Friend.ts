import { Entity, Column, ManyToOne } from 'typeorm';
import BaseModel from './BaseModel';
import User from './User';

@Entity()
export default class Friend extends BaseModel {
  @Column({ default: false })
  accepted: boolean;

  @ManyToOne(type => User)
  user1: User;

  @ManyToOne(type => User)
  user2: User;
}
