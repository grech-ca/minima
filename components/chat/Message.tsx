import { FC } from 'react';

interface Props {
  content: string;
}

const Message: FC<Props> = ({ content }) => {
  return <div className="flex rounded-md py-1 px-3 mb-3 mr-3 bg-gray-50 text-gray-700 w-auto">{content}</div>;
};

export default Message;
