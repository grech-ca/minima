import { FC, useMemo, Fragment, useCallback } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';

import Modal from 'components/common/Modal';
import ChatTab from 'components/chat/ChatTab';

import useModal from 'hooks/useModal';

import getMembersNames from 'helpers/getMembersNames';

import { useConversationsQuery, User, Conversation } from 'generated/graphql';

const ChatTopbar: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { openModal, closeModal } = useModal();

  const { data } = useConversationsQuery();
  const { conversations = [] } = data || {};

  const currentConversation = useMemo(() => {
    const conversation = conversations.find(conversation => conversation.id === id);
    return conversation;
  }, [conversations, id]);

  const open = useCallback(() => openModal('MOBILE_CHATS'), [openModal]);

  return (
    <Fragment>
      <div className="flex items-center bg-white py-2 px-4 border-b border-gray-50 h-16 max-h-16">
        <button onClick={open} className="inline-flex items-center opacity-40 focus: outline-none color-white mr-4">
          <Image src="/icons/menu.svg" color="#fff" height={30} width={30} />
        </button>
        <div className="flex-1 flex items-center justify-between">
          <div className="mb-0 text-lg font-bold">
            {currentConversation?.name ?? getMembersNames((currentConversation?.members || []) as User[])}
          </div>
          <div className="inline-flex items-center opacity-40">
            <span className="font-bold -mb-0.5 mr-2 text-lg">{currentConversation?.members?.length ?? 0}</span>
            <Image src="/icons/group.svg" height={20} width={20} />
          </div>
        </div>
      </div>
      <Modal className="w-11/12 h-5/6 max-h-5/6" name="MOBILE_CHATS" title="Conversations">
        <div className="flex flex-col items-stretch overflow-auto">
          {conversations.map(conversation => (
            <ChatTab key={conversation.id} conversation={conversation as Conversation} onClick={closeModal} />
          ))}
        </div>
      </Modal>
    </Fragment>
  );
};

export default ChatTopbar;
