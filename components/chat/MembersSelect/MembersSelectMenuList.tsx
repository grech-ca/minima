import { FC } from 'react';

import { MenuListComponentProps } from 'react-select';

const MembersSelectMenuList: FC<MenuListComponentProps<any, any>> = ({ children }) => {
  return <div className="max-h-80">{children}</div>;
};

export default MembersSelectMenuList;
