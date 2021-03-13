import { FC } from 'react';

import { OptionProps } from 'react-select';

const MemberSelectOption: FC<OptionProps<any, any>> = ({ label, innerProps }) => (
  <div {...innerProps} className="flex items-center py-2 px-3 bg-white hover:bg-indigo-50">
    <div className="rounded-full bg-gray-100 w-8 h-8 mr-3 ring-2 ring-indigo-200" />
    <div>{label}</div>
  </div>
);

export default MemberSelectOption;
