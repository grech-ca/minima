import { FC } from 'react';

import classnames from 'classnames';

import { Field, FieldProps } from 'formik';

interface Props {
  name: string;
  title: string;
  options: Record<string, string | number>[];
  valueKey: string;
  OptionComponent: FC<any>;
}

const PickerPalette: FC<Props> = ({ name, title, options, valueKey, OptionComponent }) => (
  <Field name={name}>
    {({ field: { value }, form: { setFieldValue } }: FieldProps) => (
      <div className="flex flex-col flex-1 min-w-max mx-2">
        <h5 className="text-center font-bold text-lg mb-3 text-gray-600">{title}</h5>
        <div className="grid grid-cols-5 gap-2 grid-rows-auto overflow-y-auto items-stretch p-0.5">
          {options.map((option, index) => (
            <button
              key={`${name}-${option[valueKey]}-${index}`}
              onClick={() => setFieldValue(name, option[valueKey])}
              className={classnames('items-stretch rounded-lg focus:outline-none h-12 w-14 overflow-hidden', {
                ['ring-2 ring-indigo-300']: option[valueKey] === value,
              })}
            >
              <OptionComponent {...option} />
            </button>
          ))}
        </div>
      </div>
    )}
  </Field>
);

export default PickerPalette;
