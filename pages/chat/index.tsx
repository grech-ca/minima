import { FC, Fragment } from 'react';

import Image from 'next/image';

import Header from 'components/common/Header';
import ChatSidebar from 'components/chat/ChatSidebar';
import CreateChat from 'components/chat/CreateChat';

const Posts: FC = () => (
  <Fragment>
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 container flex sm:my-6 align-start overflow-y-hidden">
        <ChatSidebar />
        <div className="flex flex-1 align-center justify-center flex-col h-full">
          <Image src="/illustrations/chat.svg" width={300} height={300} />
          <div className="flex flex-col justify-center mt-10">
            <h1 className="text-4xl text-center text-indigo-400 mb-4">No chat selected</h1>
            <p className="text-center text-2xl text-gray-300">Select one of the conversations at sidebar</p>
          </div>
        </div>
      </div>
    </div>
    <CreateChat />
  </Fragment>
);

export default Posts;
