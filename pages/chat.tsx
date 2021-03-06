import { FC } from 'react';

import Header from 'components/common/Header';
import ChatSidebar from 'components/chat/ChatSidebar';
import Chat from 'components/chat/Chat';

const Posts: FC = () => (
  <div className="flex flex-col h-full">
    <Header />
    <div className="flex-1 container flex my-6 align-start overflow-y-hidden">
      <ChatSidebar />
      <Chat />
    </div>
  </div>
);

export default Posts;
