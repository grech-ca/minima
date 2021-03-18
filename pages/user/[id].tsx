import { FC, Fragment } from 'react';

import { format } from 'date-fns';

import Image from 'next/image';

import Header from 'components/common/Header';
import Avatar from 'components/avatar/Avatar';

import client from 'startup/apollo';

import USER_QUERY from 'graphql/queries/user';

import { User } from 'generated/graphql';

import { GetServerSideProps } from 'next';

interface Props {
  user: User;
}

const UserPage: FC<Props> = ({ user }) => {
  const { avatarColor, avatarIcon, name, createdAt } = user || {};

  if (!user) {
    return (
      <Fragment>
        <div className="h-full flex flex-col">
          <Header />
          <div className="flex flex-1 justify-center items-center flex-col">
            <Image src="/illustrations/not-found.svg" height={250} width="auto" />
            <div className="text-4xl text-indigo-500">No users found</div>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <div className="flex flex-col items-stretch">
      <Header />
      <div className="flex flex-col items-center">
        <div className="bg-indigo-300 h-52 w-full" />
        <div className="-mt-20 rounded-xl pb-6 bg-white flex flex-col items-center w-6/12">
          <div className="-mt-24 mb-4 rounded-full border-8 border-indigo-300">
            <Avatar icon={avatarIcon} color={avatarColor} size={120} variant="round" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-600">{name}</h1>
          <span className="text-gray-700">Joined {format(new Date(createdAt), 'PPP')}</span>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const { data } = await client.query({
    query: USER_QUERY,
    variables: {
      id: params.id,
    },
  });

  return {
    props: {
      user: data.user,
    },
  };
};

export default UserPage;
