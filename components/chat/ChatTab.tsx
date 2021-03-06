import { FC } from 'react';

import classnames from 'classnames';

export interface Props {
  id: string;
  name: string;
  active: boolean;
  onClick: (id: string) => void;
}

const ChatTab: FC<Props> = ({ id, name, active, onClick }) => (
  <li
    onClick={() => onClick(id)}
    className={classnames(
      'flex py-4 px-6 hover:bg-gray-50 hover:text-gray-700 text-gray-400 cursor-pointer border-b-2 border-gray-50 last:border-none',
      { ['bg-indigo-50 text-gray-700']: active },
    )}
  >
    {name}
  </li>
);

export default ChatTab;
