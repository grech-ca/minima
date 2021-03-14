import { FC, Fragment } from 'react';

import MessageComponent from 'components/chat/Message';
import LoadingOverlay from 'components/loading/LoadingOverlay';

import useAppSelector from 'hooks/useAppSelector';

import { useMessagesQuery, Message } from 'generated/graphql';

const Messages: FC = () => {
  const { activeChat } = useAppSelector(state => state.chat);

  const { data, loading } = useMessagesQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: activeChat,
    },
    skip: !activeChat,
  });
  const { messages = [] } = data || {};

  return (
    <Fragment>
      <div className="relative flex flex-1 flex-col-reverse mb-4 overflow-y-auto items-start">
        {messages.map(message => (
          <MessageComponent key={message.id} message={message as Message} />
        ))}
        {loading && !data && <LoadingOverlay />}
      </div>
    </Fragment>
  );
};

export default Messages;
