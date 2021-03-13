import { ObjectSchema } from 'yup';

import { FormErrors } from '../errors/FormError';

// TODO: Improve typization
const validateSchema = <Schema>(args: Schema, schema: ObjectSchema<any>): Promise<void> => {
  return new Promise((resolve, reject) => {
    schema
      .validate(args, { abortEarly: false })
      .then(() => resolve())
      .catch((errors: any) => {
        const schemaErrors: FormErrors = errors.inner.reduce((errorsObject: FormErrors, { path, message }: any) => {
          return { ...errorsObject, [path]: message };
        }, {});

        reject(schemaErrors);
      });
  });
};

export default validateSchema;
