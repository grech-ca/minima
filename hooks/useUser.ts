import { useMeQuery, User, Maybe } from 'generated/graphql';

const useUser = (): Maybe<Omit<User, 'createdAt'>> => {
  const { data } = useMeQuery({ skip: typeof localStorage !== 'undefined' && !localStorage?.getItem('token') });

  if (!data) return null;

  return data.me;
};

export default useUser;
