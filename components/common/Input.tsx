import { FC, InputHTMLAttributes, DetailedHTMLProps } from 'react';

import classnames from 'classnames';

import { Field, FieldAttributes, FieldInputProps, FieldProps } from 'formik';

type InputProps = Exclude<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FieldInputProps<string>
>;

interface Props {
  inputProps?: InputProps;
}

const Input: FC<FieldAttributes<Props>> = ({ inputProps, ...props }) => {
  return (
    <Field {...props}>
      {({ field, meta }: FieldProps) => (
        <div className="flex flex-col items-stretch mb-4">
          <input
            spellCheck={false}
            className={classnames(
              'bg-gray-50 outline-none rounded-md text-lg py-2 px-4 focus:ring-4 focus:ring-indigo-300',
              { ['ring-4 ring-red-300']: meta.touched && meta.error },
            )}
            {...inputProps}
            {...field}
          />
          {meta.touched && meta.error && <div className="mt-2 text-red-300 text-capitalize-first">{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};

export default Input;
