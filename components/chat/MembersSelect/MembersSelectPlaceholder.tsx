import { FC } from 'react';

import classnames from 'classnames';

import { useField } from 'formik';

import { PlaceholderProps } from 'react-select';

const MembersSelectPlaceholder: FC<PlaceholderProps<any, any>> = ({ isFocused }) => {
  const [{ value }] = useField('multiple');

  return (
    <div
      className={classnames('absolute left-3 flex items-center inset-y-0 pointer-events-none', {
        ['text-gray-300']: isFocused,
        ['text-gray-400']: !isFocused,
      })}
    >
      Select {value ? 'friends' : 'a friend'}
    </div>
  );
};

export default MembersSelectPlaceholder;
