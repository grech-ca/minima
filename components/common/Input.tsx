import { FC, InputHTMLAttributes, DetailedHTMLProps } from 'react';

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
      {({ field }: FieldProps) => (
        <div className="flex flex-col items-stretch">
          <input
            className="bg-gray-50 outline-none rounded-md text-lg mb-4 py-2 px-4 focus:ring-4 focus:ring-indigo-300"
            {...inputProps}
            {...field}
          />
        </div>
      )}
    </Field>
  );
};

export default Input;
