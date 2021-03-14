import { FC } from 'react';

import { format } from 'date-fns';

import { Message } from 'generated/graphql';

interface Props {
  message: Message;
}

const MessageComponent: FC<Props> = ({ message: { author, content, createdAt } }) => {
  return (
    <div className="inline-flex mr-3 mb-1">
      <div className="rounded-full bg-gray-100 w-10 h-10 mr-2" />
      <div className="flex flex-col">
        <span className="font-bold text-gray-600">{author.name}</span>
        <div className="flex rounded-md rounded-tl-none py-1 px-3 mb-1 bg-gray-100 text-gray-700 w-auto">
          <p className="flex mb-1">{content}</p>
          <span className="ml-2 text-gray-500 self-end text-xs">{format(new Date(createdAt), 'H:m')}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
