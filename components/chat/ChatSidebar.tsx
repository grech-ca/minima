import { FC, useCallback, useState, useMemo, ChangeEvent } from 'react';

import { matchSorter } from 'match-sorter';

import ChatTab from 'components/chat/ChatTab';

import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import useModal from 'hooks/useModal';

import { setActiveChat } from 'ducks/chat/chatSlice';

import { useConversationsQuery, User } from 'generated/graphql';

const getMembersNames = (members: Pick<User, 'name' | 'id'>[]) => {
  return members
    .map(({ name }) => name)
    .slice(0, 3)
    .join(', ');
};

const ChatSidebar: FC = () => {
  const { openModal } = useModal();

  const { activeChat } = useAppSelector(state => state.chat);

  const { data } = useConversationsQuery();
  const { me } = data || {};
  const { conversations = [] } = me || {};

  const dispatch = useAppDispatch();

  const [search, setSearch] = useState('');

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'search':
        return setSearch(value);
    }
  }, []);

  const chatsBySearch = useMemo(() => {
    return matchSorter(conversations, search, { keys: ['members.*.name'] });
  }, [conversations, search]);

  const handleClick = useCallback(id => dispatch(setActiveChat(id)), [dispatch]);

  const openCreateChat = useCallback(() => openModal('CREATE_CHAT'), [openModal]);

  return (
    <div className="flex flex-col bg-white w-3/12 rounded-md mr-4 overflow-hidden p-3">
      <div className="flex mb-5">
        <input
          className="flex-1 text-gray-600 rounded-md bg-gray-50 placeholder-gray-300 py-1 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Search"
          name="search"
          value={search}
          onChange={handleChange}
        />
        <button
          onClick={openCreateChat}
          className="transition-colors rounded-md text-2xl text-indigo-400 ml-2 w-8 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-500 focus:outline-none"
        >
          +
        </button>
      </div>
      <ul className="flex flex-col">
        {(search ? chatsBySearch : conversations).map(({ id, members }) => (
          <ChatTab onClick={handleClick} active={id === activeChat} key={id} id={id} name={getMembersNames(members)} />
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
