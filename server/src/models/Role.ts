import { Entity, Column, OneToMany } from 'typeorm';
import BaseModel from './BaseModel';
import { User } from './';

@Entity()
export default class Role extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  abbreviation: string;

  @Column({ unique: true })
  color: string;

  @OneToMany(type => User, user => user.role)
  users: User[];
}
