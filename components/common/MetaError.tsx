import { FC } from 'react';

import { useField } from 'formik';

interface Props {
  field: string;
}

const MetaError: FC<Props> = ({ field }) => {
  const [_, meta] = useField(field);

  if (meta.touched && meta.error) return <div className="my-1 text-red-300 text-capitalize-first">{meta.error}</div>;

  return null;
};

export default MetaError;
