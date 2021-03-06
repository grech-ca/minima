import { FC } from 'react';

import Message from 'components/chat/Message';

import useAppSelector from 'hooks/useAppSelector';

import { useMessagesQuery } from 'generated/graphql';

const Messages: FC = () => {
  const { activeChat } = useAppSelector(state => state.chat);

  const { data } = useMessagesQuery({
    variables: {
      id: activeChat,
    },
    skip: !activeChat,
  });
  const { messages = [] } = data || {};

  return (
    <div className="flex flex-1 flex-col-reverse mb-4 overflow-y-auto items-start">
      {messages.map(({ id, content }) => (
        <Message key={id} content={content} />
      ))}
    </div>
  );
};

export default Messages;
