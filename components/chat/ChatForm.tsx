import { FC, useState, useCallback, ChangeEvent, KeyboardEvent, FormEvent } from 'react';

import PaperPlaneIcon from 'components/icons/PaperPlane';

import useAppSelector from 'hooks/useAppSelector';

import MESSAGES_QUERY from 'graphql/queries/messages';

import { MutationUpdaterFn } from '@apollo/client';
import { SendMessageMutation, useSendMessageMutation } from 'generated/graphql';

const ChatForm: FC = () => {
  const { activeChat } = useAppSelector(state => state.chat);

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
          id: activeChat,
        },
      };

      const { messages = [] } = cache.readQuery(query);

      const newMessage = {
        id: `new-message-id-${Date.now()}`,
        content: message,
        author: {
          id: 'new-message-author-id',
          name: 'Author',
        },
      };

      cache.writeQuery({
        ...query,
        data: {
          messages: [newMessage, ...messages],
        },
      });
    },
    [activeChat, message],
  );

  const handleSend = useCallback(() => {
    if (!activeChat) return;

    void sendMessage({
      variables: {
        id: activeChat,
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
        },
      },
      update: handleUpdateCache,
    }).catch(err => console.error(err));
  }, [activeChat, handleUpdateCache, message, sendMessage]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        setMessage('');
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
