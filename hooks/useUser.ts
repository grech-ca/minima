import { useRouter } from 'next/router';

import { useMeQuery, User, Maybe } from 'generated/graphql';

interface UserHookResult {
  user: Maybe<Omit<User, 'createdAt'>>;
  logout: () => void;
}

type UserHook = () => UserHookResult;

const useUser: UserHook = () => {
  const { push } = useRouter();

  const { data } = useMeQuery({ skip: typeof localStorage !== 'undefined' && !localStorage?.getItem('token') });

  const logout = () => {
    if (typeof localStorage === 'undefined') return;

    localStorage.removeItem('token');
    return push('/login');
  };

  return {
    user: data?.me,
    logout,
  };
};

export default useUser;
