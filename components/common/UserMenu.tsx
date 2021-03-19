import { FC } from 'react';

import classnames from 'classnames';

import { Popup } from 'reactjs-popup';
import Link from 'next/link';

import Avatar from 'components/avatar/Avatar';

import useUser from 'hooks/useUser';

const UserMenu: FC = () => {
  const me = useUser();

  return (
    <Popup
      arrow={false}
      position="bottom center"
      offsetY={10}
      offsetX={8}
      trigger={open => (
        <button
          className={classnames(
            'transition-colors cursor-pointer focus:outline-none flex items-center py-1.5 px-4 rounded-md hover:bg-indigo-300',
            { 'bg-gray-700 bg-opacity-10': open },
          )}
        >
          <span className="text-white text-lg font-bold mr-3 h-full">{me?.name}</span>
          <Avatar icon={me?.avatarIcon} color={me?.avatarColor} size={30} variant="round" />
        </button>
      )}
    >
      <ul className="bg-white rounded-md w-48 overflow-hidden avatar-picker">
        <li className="transition-colors hover:bg-gray-50">
          <Link href={`/user/${me?.id}`}>
            <a className="flex items-center p-2">
              <Avatar className="mr-3" icon={me?.avatarIcon} color={me?.avatarColor} size={32} variant="round" />
              <div className="flex flex-col">
                <span className="text-gray-700 text-lg font-bold leading-tight">{me?.name}</span>
                <span className="text-sm leading-tight text-gray-400">Go to Profile</span>
              </div>
            </a>
          </Link>
        </li>
        <hr />
        <li className="transition-colors hover:bg-gray-50">
          <Link href={`/user/${me?.id}`}>
            <a className="flex items-center py-1.5 px-2 text-gray-500">Edit profile</a>
          </Link>
        </li>
        <li className="transition-colors hover:bg-gray-50">
          <button className="flex items-center py-1.5 px-2 text-gray-500 focus:outline-none w-full">Log out</button>
        </li>
      </ul>
    </Popup>
  );
};

export default UserMenu;
