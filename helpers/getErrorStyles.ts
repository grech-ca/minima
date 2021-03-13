import { FieldMetaProps } from 'formik';

interface ClassValue {
  [key: string]: any;
}

const getErrorStyles = <T = any>(meta: FieldMetaProps<T>): ClassValue => ({
  ['ring-2 ring-red-300']: meta.touched && meta.error,
});

export default getErrorStyles;
