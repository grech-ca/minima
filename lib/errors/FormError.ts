import { ApolloError } from 'apollo-server';

export interface FormErrors {
  [key: string]: string;
}

class FormError extends ApolloError {
  constructor(errors: FormErrors) {
    super('Validation Failed', 'VALIDATION_SCHEMA_ERROR', { validationErrors: errors });
  }
}

export default FormError;
