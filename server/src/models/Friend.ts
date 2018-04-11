import { Field, ObjectType } from 'type-graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import BaseModel from './BaseModel';
import { User } from './';

@ObjectType()
@Entity()
export default class Friend extends BaseModel {
  @Field()
  @Column({ default: false })
  accepted: boolean;

  @Column() user1Id: number;

  @Field()
  @ManyToOne(type => User)
  user1: User;

  @Column() user2Id: number;

  @Field()
  @ManyToOne(type => User)
  user2: User;
}
