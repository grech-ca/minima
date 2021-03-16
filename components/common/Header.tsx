import { FC } from 'react';

import Avatar from 'components/avatar/Avatar';

import useUser from 'hooks/useUser';

const Header: FC = () => {
  const me = useUser();

  return (
    <div className="bg-indigo-400">
      <div className="container flex items-center py-2">
        <span className="font-bold text-white text-3xl">Minima</span>
        <input
          className="flex outline-none placeholder-gray-300 rounded-md ml-10 py-2 px-3 w-60 bg-white text-gray-900"
          placeholder="Search"
        />
        <div className="flex-1" />
        <div className="flex items-center">
          <button className="bg-white rounded-md py-2 px-3 text-gray-900 mr-8 outline-none">Write a post</button>
          <div className="w-10 h-10">
            <Avatar icon={me?.avatarIcon} color={me?.avatarColor} size={30} variant="round" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
