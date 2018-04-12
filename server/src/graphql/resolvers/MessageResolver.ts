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
import { SystemError } from '../../errors';
import { Message, User } from '../../models';

@ArgsType()
class AddMessageArgs {
  @Field() text: string;
}

@Resolver(objectType => Message)
export default class MessageResolver {
  @FieldResolver()
  user(@Root() message: Message) {
    return message.user || User.findOneById(message.userId);
  }

  @Query(returns => [Message], { nullable: true })
  messages() {
    return Message.find({ order: { id: 'DESC' }, take: 10 });
  }

  @Query(returns => Message, { nullable: true })
  message(
    @Arg('id', type => ID)
    id: number
  ) {
    return Message.findOneById(id);
  }

  @Authorized()
  @Mutation(returns => Message)
  async addMessage(
    @PubSub('messageAdded') publish: Publisher<Message>,
    @Args() args: AddMessageArgs,
    @Ctx() { user }: any
  ) {
    try {
      const message = await Message.create({ ...args, user }).save();
      publish(message);
      return message;
    } catch (err) {
      throw new SystemError(err);
    }
  }

  @Authorized(['owner', 'admin', 'mod'])
  @Mutation(returns => ID)
  async deleteMessage(
    @PubSub('messageDeleted') publish: Publisher<number>,
    @Arg('id', type => ID)
    id: number
  ) {
    try {
      await Message.removeById(id);
      publish(id);
      return id;
    } catch (err) {
      throw new SystemError(err);
    }
  }

  @Authorized(['owner', 'admin'])
  @Mutation(returns => Boolean)
  async deleteAllMessages(
    @PubSub('allMessagesDeleted') publish: Publisher<boolean>
  ) {
    try {
      await Message.createQueryBuilder('message')
        .delete()
        .execute();
      publish(true);
      return true;
    } catch (err) {
      throw new SystemError(err);
    }
  }

  @Authorized()
  @Subscription(returns => Message, { topics: 'messageAdded' })
  messageAdded(@Root() message: Message) {
    return message;
  }

  @Authorized()
  @Subscription(returns => ID, { topics: 'messageDeleted' })
  messageDeleted(@Root() id: number) {
    return id;
  }

  @Authorized()
  @Subscription(returns => Boolean, { topics: 'allMessagesDeleted' })
  allMessagesDeleted(@Root() status: boolean) {
    return status;
  }
}
