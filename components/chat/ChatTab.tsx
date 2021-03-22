import { FC, useCallback } from 'react';
import { useRouter } from 'next/router';

import classnames from 'classnames';

import Link from 'next/link';
import Image from 'next/image';

import useUser from 'hooks/useUser';

import getMembersNames from 'helpers/getMembersNames';

import { Conversation, User } from 'generated/graphql';

export interface Props {
  conversation: Conversation;
  onClick?: () => void;
}

const ChatTab: FC<Props> = ({ conversation: { id, name, members, multiple }, onClick }) => {
  const router = useRouter();
  const { id: idParam } = router.query;

  const { user } = useUser();

  const handleClick = useCallback(() => onClick?.(), [onClick]);

  return (
    <li
      className={classnames(
        'transition-all flex md:py- md:px-6 cursor-pointer rounded-md mb-2 py-1 px-3 h-14 items-center',
        {
          ['bg-gray-50 text-gray-400']: id !== idParam,
          ['bg-indigo-400 text-white font-bold']: id === idParam,
        },
      )}
    >
      <Link href={`/chat/${id}`}>
        <a onClick={handleClick} className="flex justify-between items-center h-full w-full">
          <label>{name ?? getMembersNames(members, { me: user as User, withoutMe: !multiple })}</label>
          {multiple && (
            <div className="inline-flex items-center opacity-30">
              <span className="text-black mr-1.5 -mb-1">{members.length}</span>
              <Image src="/icons/group.svg" height={16} width={16} />
            </div>
          )}
        </a>
      </Link>
    </li>
  );
};

export default ChatTab;
