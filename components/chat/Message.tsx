import { FC, useMemo } from 'react';

import { format } from 'date-fns';

import classnames from 'classnames';

import Avatar from 'components/avatar/Avatar';

import useUser from 'hooks/useUser';

import { Message } from 'generated/graphql';

interface Props {
  message: Message;
}

const MessageComponent: FC<Props> = ({ message: { author, content, createdAt } }) => {
  const { user } = useUser();

  const isOutgoing = useMemo(() => user && author && user.id === author.id, [author, user]);

  return (
    <div className="inline-flex mr-3 mb-1 h-auto">
      <div className="w-10 h-10 mr-2">
        <Avatar icon={author?.avatarIcon} color={author?.avatarColor} size={28} variant="round" />
      </div>
      <div className="flex flex-1 flex-col h-full">
        <span className="font-bold text-gray-600">{author.name}</span>
        <div
          className={classnames('flex rounded-md rounded-tl-none py-1 px-3 mb-1 w-auto h-full', {
            'bg-indigo-400 text-white': isOutgoing,
            'bg-gray-100 text-gray-700': !isOutgoing,
          })}
        >
          <p className="flex mb-1 break-all h-full">{content}</p>
          <span
            className={classnames('ml-2 self-end text-xs', {
              'text-white': isOutgoing,
              'text-gray-500': !isOutgoing,
            })}
          >
            {format(new Date(createdAt), 'H:m')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
