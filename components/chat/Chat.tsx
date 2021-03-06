import { FC } from 'react';

import Image from 'next/image';

import Dialog from 'components/chat/Dialog';
import ChatForm from 'components/chat/ChatForm';

import useAppSelector from 'hooks/useAppSelector';

const Chat: FC = () => {
  const { activeChat } = useAppSelector(state => state.chat);

  if (!activeChat) {
    return (
      <div className="flex flex-1 align-center justify-center flex-col h-full">
        <Image src="/illustrations/chat.svg" width={300} height={300} />
        <div className="flex flex-col justify-center mt-10">
          <h1 className="text-4xl text-center text-indigo-400 mb-4">No chat selected</h1>
          <p className="text-center text-2xl text-gray-300">Select one of the conversations at sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white p-4 rounded-md h-full overflow-hidden">
      <Dialog />
      <ChatForm />
    </div>
  );
};

export default Chat;
