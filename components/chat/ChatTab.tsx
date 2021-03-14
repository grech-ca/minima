import { FC } from 'react';
import { useRouter } from 'next/router';

import classnames from 'classnames';

import Link from 'next/link';

export interface Props {
  id: string;
  name: string;
}

const ChatTab: FC<Props> = ({ id, name }) => {
  const router = useRouter();
  const { id: idParam } = router.query;

  return (
    <Link href={`/chat/${id}`}>
      <li
        className={classnames(
          'transition-all flex md:py-4 md:px-6 bg-gray-50 text-gray-400 cursor-pointer mb-2 rounded-md py-2 px-3',
          {
            ['bg-indigo-50 text-indigo-400']: id === idParam,
          },
        )}
      >
        {name}
      </li>
    </Link>
  );
};

export default ChatTab;
