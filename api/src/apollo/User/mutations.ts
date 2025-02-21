import { idArg, inputObjectType, mutationField, nonNull } from 'nexus';

export const UserCreateInputType = inputObjectType({
  name: 'UserCreateInputType',
  description: 'Input arguments used in createUser mutation',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('uid');
    t.string('name');
    t.string('photo');
    t.gender('gender');
    t.date('dob');
    t.string('state');
    t.string('city');
    t.string('college');
    t.string('stream');
    t.string('mobile');
    t.string('referredBy');
    t.string('rollNumber');
  },
});

export const createUser = mutationField('createUser', {
  type: 'User',
  description: 'Creates a new user record',
  args: {
    user: nonNull('UserCreateInputType'),
  },
  /**
   * TODO: add validations on
   * - email
   * - mobile
   */
  async resolve(_parent, args, { prisma }) {
    if (args.user.rollNumber) {
      const users = await prisma.user.findMany({
        where: {
          rollNumber: args.user.rollNumber,
        },
      });

      if (users.length > 0) {
        throw new Error('Roll Number already registered');
      }
    }
    return prisma.user.create({
      data: {
        ...args.user,
        selfID: args.user?.mobile,
      },
    });
  },
});

export const UserUpdateInputType = inputObjectType({
  name: 'UserUpdateInputType',
  description: 'Input arguments used in updateUser mutation',
  definition(t) {
    t.string('name');
    t.string('photo');
    t.gender('gender');
    t.date('dob');
    t.string('state');
    t.string('city');
    t.string('college');
    t.string('stream');
    t.string('mobile');
    t.string('selfID');
    t.id('festID');
    t.string('referredBy');
    t.string('rollNumber');
    t.id('ca');
  },
});

export const updateUser = mutationField('updateUser', {
  type: 'User',
  description: 'Updates an existing user record',
  args: {
    id: nonNull(idArg()),
    user: nonNull('UserUpdateInputType'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.user.update({
      where: { id: args.id },
      data: {
        name: args.user?.name || undefined,
        photo: args.user?.photo || undefined,
        gender: args.user?.gender || undefined,
        dob: args.user?.dob || undefined,
        state: args.user?.state || undefined,
        city: args.user?.city || undefined,
        college: args.user?.college || undefined,
        stream: args.user?.stream || undefined,
        mobile: args.user?.mobile || undefined,
        selfID: args.user?.selfID || undefined,
        festID: args.user?.festID ? { push: args.user?.festID } : undefined,
        referredBy: args.user?.referredBy || undefined,
        rollNumber: args.user?.rollNumber || undefined,
        ca: args.user?.ca ? { push: args.user?.ca } : undefined,
      },
    });
  },
});
