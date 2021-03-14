import { FC, useCallback, useState, useMemo, ChangeEvent } from 'react';

import { matchSorter } from 'match-sorter';

import ChatTab from 'components/chat/ChatTab';

import useModal from 'hooks/useModal';

import { useConversationsQuery, User } from 'generated/graphql';

const getMembersNames = (members: Pick<User, 'name' | 'id'>[]) => {
  return members
    .map(({ name }) => name)
    .slice(0, 3)
    .join(', ');
};

const ChatSidebar: FC = () => {
  const { openModal } = useModal();

  const { data } = useConversationsQuery();
  const { conversations = [] } = data || {};

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

  const openCreateChat = useCallback(() => openModal('CREATE_CHAT'), [openModal]);

  return (
    <div className="hidden flex-col bg-white md:w-4/12 lg:w-3/12 rounded-md mr-4 overflow-hidden p-3 md:flex">
      <div className="w-full flex-col mb-4 lg:flex lg:flex-row xl:mb-5">
        <input
          className="flex-1 w-full flex mb-2 text-gray-600 rounded-md bg-gray-50 placeholder-gray-300 py-1 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 lg:mb-0"
          placeholder="Search"
          name="search"
          value={search}
          onChange={handleChange}
        />
        <button
          onClick={openCreateChat}
          className="transition-colors rounded-md text-2xl text-indigo-400 ml-0 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-500 focus:outline-none md:w-full lg:w-10 lg:ml-2"
        >
          +
        </button>
      </div>
      <ul className="flex flex-col overflow-y-auto">
        {(search ? chatsBySearch : conversations).map(({ id, members }) => (
          <ChatTab key={id} id={id} name={getMembersNames(members)} />
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
