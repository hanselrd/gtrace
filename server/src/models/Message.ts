import { Entity, Column } from 'typeorm';
import BaseModel from './BaseModel';

@Entity()
export default class Message extends BaseModel {
  @Column({ type: 'text' })
  text: string;
}
