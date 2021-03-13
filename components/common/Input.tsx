import { FC, InputHTMLAttributes, DetailedHTMLProps } from 'react';

import classnames from 'classnames';

import { Field, FieldAttributes, FieldInputProps, FieldProps } from 'formik';

import MetaError from 'components/common/MetaError';

import getErrorStyles from 'helpers/getErrorStyles';

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
              getErrorStyles(meta),
            )}
            {...inputProps}
            {...field}
          />
          <MetaError field={props.name} />
        </div>
      )}
    </Field>
  );
};

export default Input;
