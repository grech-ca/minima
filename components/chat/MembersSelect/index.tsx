import { FC, useState, useCallback, useEffect } from 'react';

import classnames from 'classnames';

import { Field, FieldProps } from 'formik';
import ReactSelect from 'react-select';

import MembersSelectControl from 'components/chat/MembersSelect/MembersSelectControl';
import MembersSelectInput from 'components/chat/MembersSelect/MembersSelectInput';
import MembersSelectMenu from 'components/chat/MembersSelect/MembersSelectMenu';
import MembersSelectMenuList from 'components/chat/MembersSelect/MembersSelectMenuList';
import MemberselectOption from 'components/chat/MembersSelect/MembersSelectOption';
import MembersSelectSingleValue from 'components/chat/MembersSelect/MembersSelectSingleValue';
import MembersSelectValueContainer from 'components/chat/MembersSelect/MembersSelectValueContainer';
import MemberselectNoOptions from 'components/chat/MembersSelect/MembersSelectNoOptions';
import MembersSelectPlaceholder from 'components/chat/MembersSelect/MembersSelectPlaceholder';

import MetaError from 'components/common/MetaError';

import { useUsersQuery } from 'generated/graphql';

interface Props {
  multiple?: boolean;
  className?: string;
}

interface Option {
  value: string;
  label: string;
}

const MembersSelect: FC<Props> = ({ multiple = false, className }) => {
  const { data } = useUsersQuery();
  const { users } = data || {};

  const [inputValue, setInputValue] = useState('');

  const handleInput = useCallback(value => setInputValue(value), []);

  useEffect(() => setInputValue(''), [multiple]);

  return (
    <Field name="members" className={className}>
      {({ field: { value }, form: { setFieldValue } }: FieldProps) => {
        const handleChange = (members: Option[] | Option) => setFieldValue('members', members);

        return (
          <div className={classnames(className)}>
            <ReactSelect
              isMulti={multiple}
              onChange={handleChange}
              value={value}
              inputValue={inputValue}
              onInputChange={handleInput}
              options={users?.map(({ id, name }) => ({ value: id, label: name }))}
              menuPortalTarget={document.body}
              hideSelectedOptions={multiple}
              components={{
                IndicatorsContainer: () => null,
                IndicatorSeparator: () => null,
                Placeholder: MembersSelectPlaceholder,
                Input: MembersSelectInput,
                Control: MembersSelectControl,
                Menu: MembersSelectMenu,
                MenuList: MembersSelectMenuList,
                Option: MemberselectOption,
                SingleValue: MembersSelectSingleValue,
                ValueContainer: MembersSelectValueContainer,
                NoOptionsMessage: MemberselectNoOptions,
              }}
            />
            <MetaError field="members" />
          </div>
        );
      }}
    </Field>
  );
};

export default MembersSelect;
