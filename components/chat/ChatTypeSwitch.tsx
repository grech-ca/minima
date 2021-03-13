import { FC, MouseEvent } from 'react';

import classnames from 'classnames';

import { Field, FieldProps } from 'formik';

interface Props {
  className?: string;
}

const ChatTypeSwitch: FC<Props> = ({ className }) => (
  <Field name="multiple">
    {({ field: { value }, form: { setFieldValue } }: FieldProps) => {
      const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const { value: buttonValue } = e.target as HTMLButtonElement;

        const isMultiple = buttonValue === 'true' ? true : false;

        setFieldValue('multiple', isMultiple);
      };

      return (
        <div className={classnames('flex', className)}>
          <button
            className={classnames('flex-1 px-3 py-2 rounded-l-md bg-gray-50 text-gray-500 focus:outline-none', {
              ['bg-indigo-100 text-indigo-500']: value === false,
            })}
            value="false"
            onClick={handleClick}
          >
            Personal
          </button>
          <button
            className={classnames('flex-1 px-3 py-2 rounded-r-md bg-gray-50 text-gray-500 focus:outline-none', {
              ['bg-indigo-100 text-indigo-500']: value === true,
            })}
            value="true"
            onClick={handleClick}
          >
            Multipersonal
          </button>
        </div>
      );
    }}
  </Field>
);

export default ChatTypeSwitch;
