import { FC } from 'react';

import { MenuProps } from 'react-select';

const MembersSelectMenu: FC<MenuProps<any, any>> = ({ children, innerProps }) => (
  <div {...innerProps} className="mt-2 ring-2 ring-indigo-200 rounded-md overflow-hidden cursor-pointer">
    {children}
  </div>
);

export default MembersSelectMenu;
