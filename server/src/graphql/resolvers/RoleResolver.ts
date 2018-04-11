import {
  Field,
  Resolver,
  Root,
  Arg,
  Args,
  ArgsType,
  Authorized,
  FieldResolver,
  Query,
  Mutation
} from 'type-graphql';
import { SystemError } from '../../errors';
import { Role, User } from '../../models';

@ArgsType()
class AddRoleArgs {
  @Field() name: string;
  @Field() abbreviation: string;
  @Field() color: string;
}

@Resolver(objectType => Role)
export default class RoleResolver {
  @FieldResolver()
  users(@Root() role: Role) {
    return role.users || User.find({ where: { roleId: role.id } });
  }

  @Query(returns => [Role], { nullable: true })
  roles() {
    return Role.find();
  }

  @Query(returns => Role, { nullable: true })
  role(@Arg('id') id: number) {
    return Role.findOneById(id);
  }

  @Authorized(['admin'])
  @Mutation(returns => Role)
  async addRole(@Args() { name, abbreviation, color }: AddRoleArgs) {
    try {
      const role = await Role.create({
        name,
        abbreviation: abbreviation || name,
        color
      }).save();
      return role;
    } catch (err) {
      throw new SystemError(err);
    }
  }
}
