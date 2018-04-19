import {
  Field,
  ID,
  Resolver,
  Root,
  Arg,
  Args,
  ArgsType,
  Ctx,
  PubSub,
  Publisher,
  Authorized,
  FieldResolver,
  Query,
  Mutation,
  Subscription
} from 'type-graphql';
import { LoginError, SignupError, UniqueKeyError } from '../../errors';
import { Message, Role, User, Friend } from '../../models';
import { AuthType } from '../types';

@ArgsType()
class SignupArgs {
  @Field() name: string;
  @Field() email: string;
  @Field() password: string;
  @Field() dob: Date;
  @Field() language: string;
}

@ArgsType()
class LoginArgs {
  @Field() email: string;
  @Field() password: string;
}

@ArgsType()
class HandleFriendRequestArgs {
  @Field(type => ID)
  id: number;
  @Field() accept: boolean;
}

@Resolver(objectType => User)
export default class UserResolver {
  @FieldResolver()
  role(@Root() user: User) {
    return user.role || Role.findOneById(user.roleId);
  }

  @FieldResolver()
  messages(@Root() user: User) {
    return user.messages || Message.find({ where: { userId: user.id } });
  }

  @Query(returns => [User], { nullable: true })
  users() {
    return User.find();
  }

  @Query(returns => User, { nullable: true })
  user(
    @Arg('id', type => ID)
    id: number
  ) {
    return User.findOneById(id);
  }

  @Authorized()
  @Query(returns => User, { nullable: true })
  currentUser(@Ctx() { user }: any) {
    return user;
  }

  @Mutation(returns => AuthType)
  async signup(
    @PubSub('userAdded') publish: Publisher<User>,
    @Args() args: SignupArgs
  ) {
    const user = await User.create(args);
    const errors = await user.validate();
    if (errors) {
      throw new SignupError({ data: errors });
    }
    try {
      await user.save();
    } catch (err) {
      if (err instanceof UniqueKeyError) {
        throw new SignupError(err);
      }
      throw err;
    }
    publish(user);
    return { token: user.generateToken(), user };
  }

  @Mutation(returns => AuthType)
  async login(@Args() { email, password }: LoginArgs) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new LoginError({
        data: { email: 'No user exists with that email' }
      });
    }
    if (!(await user.authenticate(password))) {
      throw new LoginError({
        data: { password: 'Password is incorrect' }
      });
    }
    return { token: user.generateToken(), user };
  }

  // needs checks
  @Authorized()
  @Mutation(returns => Boolean)
  async sendFriendRequest(
    @Arg('id', type => ID)
    id: number,
    @Ctx() { user }: any
  ) {
    const friendship = await Friend.create({
      user1Id: user.id,
      user2Id: id
    }).save();
    if (friendship) {
      return true;
    }
    return false;
  }

  // needs checks
  @Authorized()
  @Mutation(returns => Boolean)
  async handleFriendRequest(
    @Args() { id, accept }: HandleFriendRequestArgs,
    @Ctx() { user }: any
  ) {
    const friendship = await Friend.findOne({
      where: { user1Id: id, user2Id: user.id }
    });
    if (friendship) {
      if (accept) {
        friendship.accepted = true;
        await friendship.save();
      } else {
        await friendship.remove();
      }
      return true;
    }
    return false;
  }

  @Authorized()
  @Subscription(returns => User, { topics: 'userAdded' })
  userAdded(@Root() user: User) {
    return user;
  }
}
