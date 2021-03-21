import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

import { get } from 'lodash';

import MessageComponent from 'components/chat/Message';
import LoadingOverlay from 'components/loading/LoadingOverlay';

import useUser from 'hooks/useUser';

import MESSAGES_SUBSCRIPTION from 'graphql/subscriptions/messagesSub';

import {
  useMessagesQuery,
  Message,
  MessagesSubSubscription,
  MessagesSubSubscriptionVariables,
} from 'generated/graphql';

const Messages: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useUser();

  const { data, loading, subscribeToMore } = useMessagesQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: id as string,
    },
  });
  const { messages = [] } = data || {};

  useEffect(() => {
    if (id) {
      subscribeToMore<MessagesSubSubscription, MessagesSubSubscriptionVariables>({
        document: MESSAGES_SUBSCRIPTION,
        variables: { id: id as string },
        updateQuery: ({ messages }, { subscriptionData }) => {
          const newMessage = get(subscriptionData, 'data.conversationMessages');
          return { messages: [newMessage, ...messages] };
        },
      });
    }
  }, [id, subscribeToMore, user]);

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
