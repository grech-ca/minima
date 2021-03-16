import { FC, useRef, useMemo } from 'react';

import classnames from 'classnames';

import { useField } from 'formik';
import { Popup } from 'reactjs-popup';

import Avatar from 'components/avatar/Avatar';
import ColorOption from 'components/avatar/ColorOption';
import PickerPalette from 'components/avatar/PickerPalette';

import icons from 'data/avatars.json';
import colorsJson from 'data/colors.json';

const colors: string[] = colorsJson;

interface Props {
  iconField: string;
  colorField: string;
}

const AvatarPicker: FC<Props> = ({ iconField, colorField }) => {
  const ref = useRef<any | null>(null);

  const [icon] = useField(iconField);
  const [color] = useField(colorField);

  const iconOptions = useMemo(() => icons.map(icon => ({ icon, color: color.value as string, size: 30 })), [
    color.value,
  ]);

  const colorOptions = useMemo(() => colors.map(colorOption => ({ color: colorOption })), []);

  return (
    <Popup
      ref={ref}
      arrow={false}
      offsetY={16}
      offsetX={7}
      trigger={open => (
        <div
          role="button"
          className={classnames(
            'cursor-pointer transition-shadow w-20 h-20 self-center mb-4 focus:outline-none rounded-lg',
            {
              ['ring-4 ring-indigo-300']: open,
            },
          )}
        >
          <Avatar icon={icon.value} color={color.value} />
        </div>
      )}
    >
      <div className="avatar-picker flex rounded-xl bg-white p-3 ring-4 ring-gray-100 max-h-64">
        <PickerPalette name="avatarIcon" title="Icon" valueKey="icon" options={iconOptions} OptionComponent={Avatar} />
        <PickerPalette
          name="avatarColor"
          title="Color"
          valueKey="color"
          options={colorOptions}
          OptionComponent={ColorOption}
        />
      </div>
    </Popup>
  );
};

export default AvatarPicker;
