import { useMeQuery, User, Maybe } from 'generated/graphql';

const useUser = (): Maybe<Pick<User, 'name' | 'id' | 'avatarIcon' | 'avatarColor'>> => {
  const { data } = useMeQuery({ skip: typeof localStorage !== 'undefined' && !localStorage?.getItem('token') });

  if (!data) return null;

  return data.me;
};

export default useUser;
