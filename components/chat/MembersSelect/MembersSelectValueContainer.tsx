import { FC } from 'react';

import { ValueContainerProps } from 'react-select';

const MembersSelectValueContainer: FC<ValueContainerProps<any, any>> = ({ children }) => {
  return <div className="flex w-full">{children}</div>;
};

export default MembersSelectValueContainer;
