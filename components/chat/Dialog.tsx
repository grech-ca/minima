import { FC } from 'react';
import { useRouter } from 'next/router';

import MessageComponent from 'components/chat/Message';
import LoadingOverlay from 'components/loading/LoadingOverlay';

import { useMessagesQuery, Message } from 'generated/graphql';

const Messages: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading } = useMessagesQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: id as string,
    },
  });
  const { messages = [] } = data || {};

  return (
    <div className="relative flex flex-1 flex-col-reverse mb-4 overflow-y-auto items-start">
      {messages.map(message => (
        <MessageComponent key={message.id} message={message as Message} />
      ))}
      {loading && !data && <LoadingOverlay />}
    </div>
  );
};

export default Messages;
