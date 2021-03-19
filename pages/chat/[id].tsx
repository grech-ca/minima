import { FC, Fragment } from 'react';

import Header from 'components/common/Header';
import ChatSidebar from 'components/chat/ChatSidebar';
import Chat from 'components/chat/Chat';
import CreateChat from 'components/chat/CreateChat';

// TODO: Create subpages instead of duplicate an existing page
// TODO: Rename component
const Posts: FC = () => (
  <Fragment>
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 container flex sm:my-6 align-start overflow-y-hidden">
        <ChatSidebar />
        <Chat />
      </div>
    </div>
    <CreateChat />
  </Fragment>
);

export default Posts;
