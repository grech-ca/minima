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
      'transition-all flex md:py-4 md:px-6 bg-gray-50 text-gray-400 cursor-pointer mb-2 rounded-md py-2 px-3',
      {
        ['bg-indigo-50 text-indigo-400']: active,
      },
    )}
  >
    {name}
  </li>
);

export default ChatTab;
