import { FC } from 'react';

import { MenuListComponentProps } from 'react-select';

const MembersSelectMenuList: FC<MenuListComponentProps<any, any>> = ({ children }) => {
  return <div>{children}</div>;
};

export default MembersSelectMenuList;
