import { Field, ObjectType } from 'type-graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import BaseModel from './BaseModel';
import { User } from './';

@ObjectType()
@Entity()
export default class Role extends BaseModel {
  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column({ unique: true })
  abbreviation: string;

  @Field()
  @Column({ unique: true })
  color: string;

  @Field(type => [User], { nullable: true })
  @OneToMany(type => User, user => user.role)
  users?: User[];
}
