import { FC, Fragment, useEffect } from 'react';

import Header from 'components/common/Header';
import ChatTopbar from 'components/chat/ChatTopbar';
import ChatSidebar from 'components/chat/ChatSidebar';
import Chat from 'components/chat/Chat';
import CreateChat from 'components/chat/CreateChat';

import useMedia from 'hooks/useMedia';
import useModal from 'hooks/useModal';

// TODO: Create subpages instead of duplicate an existing page
// TODO: Rename component
const Posts: FC = () => {
  const { isActiveModal, closeModal } = useModal();

  const isMobile = useMedia(['(max-width: 640px)'], [true], false);

  useEffect(() => {
    console.log('isMobile', isMobile);
    if (isActiveModal('MOBILE_CHATS') && !isMobile) closeModal();
  }, [closeModal, isActiveModal, isMobile]);

  return (
    <Fragment>
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex-1 container flex flex-col sm:flex-row sm:my-6 align-start overflow-y-hidden">
          {isMobile ? <ChatTopbar /> : <ChatSidebar />}
          <Chat />
        </div>
      </div>
      <CreateChat />
    </Fragment>
  );
};

export default Posts;
