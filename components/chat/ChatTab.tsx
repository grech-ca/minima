import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';

import classnames from 'classnames';

import Link from 'next/link';
import Image from 'next/image';

import useUser from 'hooks/useUser';

import { Conversation, User } from 'generated/graphql';

export interface Props {
  conversation: Conversation;
}

const getMembersNames = (members: Pick<User, 'name' | 'id'>[]) => {
  return members
    .map(({ name }) => name)
    .slice(0, 3)
    .join(', ');
};

const ChatTab: FC<Props> = ({ conversation: { id, name, members, multiple } }) => {
  const router = useRouter();
  const { id: idParam } = router.query;

  const { user } = useUser();

  const interlocutors = useMemo(() => {
    if (multiple) {
      return members
        .map(member => {
          if (member.id === user.id) return { ...member, name: 'You' };
          return member;
        })
        .sort(member => {
          if (member.id === user.id) return -1;
          return 0;
        });
    }

    return members.filter(member => member.id !== user.id);
  }, [members, multiple, user.id]);

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
        <a className="flex justify-between items-center h-full w-full">
          <label>{name ?? getMembersNames(interlocutors)}</label>
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
