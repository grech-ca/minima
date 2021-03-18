import { FC, useState, useCallback, ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';

import PaperPlaneIcon from 'components/icons/PaperPlane';

import useUser from 'hooks/useUser';

import MESSAGES_QUERY from 'graphql/queries/messages';

import { MutationUpdaterFn } from '@apollo/client';
import { SendMessageMutation, useSendMessageMutation } from 'generated/graphql';

// TODO: [MIN-25] Prevent blank messages submit

const ChatForm: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const me = useUser();

  const [sendMessage] = useSendMessageMutation();

  const [message, setMessage] = useState('');

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setMessage(value);
  }, []);

  const handleUpdateCache = useCallback<MutationUpdaterFn<SendMessageMutation>>(
    (cache, { data }) => {
      if (!data) return;

      const query = {
        query: MESSAGES_QUERY,
        variables: {
          id: id as string,
        },
      };

      const { messages = [] } = cache.readQuery(query);

      const newMessage = {
        id: `new-message-id-${Date.now()}`,
        content: message,
        author: me,
        createdAt: new Date().toISOString(),
      };

      cache.writeQuery({
        ...query,
        data: {
          messages: [newMessage, ...messages],
        },
      });
    },
    [id, me, message],
  );

  const handleSend = useCallback(() => {
    setMessage('');

    void sendMessage({
      variables: {
        id: id as string,
        content: message,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        sendMessage: {
          __typename: 'Message',
          id: 'new-message-id',
          content: message,
          author: {
            id: 'new-message-author-id',
            name: 'Author',
          },
          createdAt: new Date().toISOString(),
        },
      },
      update: handleUpdateCache,
    }).catch(err => console.error(err));
  }, [handleUpdateCache, id, message, sendMessage]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!message) return;

      handleSend();
    },
    [handleSend, message],
  );

  return (
    <form onSubmit={handleSubmit} className="flex h-16 mb-1 items-stretch">
      <textarea
        autoFocus
        className="flex-1 bg-gray-50 border-2 border-gray-200 resize-none rounded-md mr-2 outline-none px-2 py-1"
        value={message}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder="Type message..."
      />
      <button
        type="submit"
        className="flex justify-center items-center bg-indigo-100 text-indigo-300 font-bold text-lg rounded-md w-24 h-full"
      >
        <PaperPlaneIcon className="fill-current" height={30} width={30} />
      </button>
    </form>
  );
};

export default ChatForm;
