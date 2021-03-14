import { FC } from 'react';

import classnames from 'classnames';

import { ControlProps } from 'react-select';
import { useField } from 'formik';

import getErrorStyles from 'helpers/getErrorStyles';

const MembersSelectControl: FC<ControlProps<any, any>> = ({ isFocused, children, innerRef, innerProps }) => {
  const [, meta] = useField('members');

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={classnames(
        'flex m-0.5 box-border py-2 px-3 text-gray-700 rounded-md relative items-center',
        {
          ['bg-white ring-2 ring-indigo-300']: isFocused,
          ['bg-gray-50']: !isFocused,
        },
        getErrorStyles(meta),
      )}
    >
      {children}
    </div>
  );
};

export default MembersSelectControl;
