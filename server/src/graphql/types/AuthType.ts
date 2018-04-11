import { Field, ObjectType } from 'type-graphql';
import { User } from '../../models';

@ObjectType()
export default class Auth {
  @Field() token: string;

  @Field() user: User;
}
