import { FC, useCallback } from 'react';

import ChatTab from 'components/chat/ChatTab';

import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';

import { setActiveChat } from 'ducks/chat/chatSlice';

import { useConversationsQuery, User } from 'generated/graphql';

const getMembersNames = (members: User[]) => {
  return members
    .map(({ name }) => name)
    .slice(0, 3)
    .join(', ');
};

const ChatSidebar: FC = () => {
  const { activeChat } = useAppSelector(state => state.chat);

  const { data } = useConversationsQuery();
  const { me } = data || {};
  const { conversations } = me || {};

  const dispatch = useAppDispatch();

  const handleClick = useCallback(id => dispatch(setActiveChat(id)), [dispatch]);

  return (
    <ul className="flex flex-col bg-white w-3/12 rounded-md mr-4 overflow-hidden">
      {conversations?.map(({ id, members }) => (
        <ChatTab onClick={handleClick} active={id === activeChat} key={id} id={id} name={getMembersNames(members)} />
      ))}
    </ul>
  );
};

export default ChatSidebar;
