import { FC, InputHTMLAttributes } from 'react';

import { InputProps } from 'react-select';

const MembersSelectInput: FC<InputProps & InputHTMLAttributes<HTMLInputElement>> = ({
  onBlur,
  onChange,
  onFocus,
  value,
}) => {
  return (
    <input
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      className={'focus:outline-none bg-transparent flex-1 h-8'}
    />
  );
};

export default MembersSelectInput;
