import { User } from 'generated/graphql';

interface GetMembersOptions {
  me?: User;
  withoutMe?: boolean;
  myName?: string;
}

type GetMembersNamesFunc = (members: User[], options?: GetMembersOptions) => string;

const getMembersNames: GetMembersNamesFunc = (members, { me = null, myName = 'You', withoutMe = false } = {}) => {
  let newMembers = [...members];

  if (me) {
    if (withoutMe) {
      newMembers = newMembers.filter(member => member.id !== me.id);
    } else {
      newMembers = newMembers
        .map(user => {
          if (user.id === me.id) {
            return { ...user, name: myName };
          }

          return user;
        })
        .sort(user => {
          if (user.id === me.id) return -1;
          return 0;
        });
    }
  }

  const names = newMembers
    .map(({ name }) => name)
    .slice(0, 3)
    .join(', ');

  return names;
};

export default getMembersNames;
