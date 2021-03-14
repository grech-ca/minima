import { FC } from 'react';

import { SingleValueProps } from 'react-select';

const MembersSelectSingleValue: FC<SingleValueProps<any>> = ({ data }) => (
  <div className="absolute left-3 flex items-center pointer-events-none">
    <div className={'rounded-full bg-gray-100 w-8 h-8 mr-2'} />
    <span>{data.label}</span>
  </div>
);

export default MembersSelectSingleValue;
