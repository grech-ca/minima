import { FC } from 'react';

interface Props {
  color: string;
}

const ColorOption: FC<Props> = ({ color }) => {
  return <div className="h-full w-full" style={{ backgroundColor: color }} />;
};

export default ColorOption;
