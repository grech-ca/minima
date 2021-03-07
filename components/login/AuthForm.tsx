import { FC, useState, useCallback } from 'react';

import * as yup from 'yup';

import { Formik, Form, FormikHelpers } from 'formik';
import { CSSTransition } from 'react-transition-group';

import Input from 'components/common/Input';
import LoadingOverlay from 'components/loading/LoadingOverlay';

import { useLoginMutation } from 'generated/graphql';

type AuthMode = 'signin' | 'signup';

interface FormInitialValues {
  name: string;
  password: string;
  email?: string;
  repeatPassword?: string;
}

const initialValues: FormInitialValues = {
  name: '',
  email: '',
  password: '',
  repeatPassword: '',
};

const AuthForm: FC = () => {
  const [login, { loading }] = useLoginMutation();

  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const handleMode = useCallback(() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup'), [authMode]);

  const handleSubmit = useCallback(
    ({ name, password }: FormInitialValues, { resetForm }: FormikHelpers<FormInitialValues>) => {
      if (authMode === 'signin') {
        void login({
          variables: {
            login: name,
            password,
          },
        })
          .then(({ data: { signin } }) => {
            localStorage.setItem('token', signin?.authToken);
            resetForm();
          })
          .catch(console.error);
      }
    },
    [authMode, login],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} className="flex flex-col flex-1 mb-3">
      <Form className="flex flex-col relative bg-white rounded-xl ml-10 px-10 py-16">
        <h1 className="text-4xl font-black mb-12 text-gray-700 text-center mx-10">Join Minima flow</h1>
        <Input
          name="name"
          inputProps={{
            autoFocus: true,
            type: 'text',
            placeholder: authMode === 'signin' ? 'Name or email' : 'Name',
          }}
        />
        <CSSTransition in={authMode === 'signup'} timeout={300} classNames="login-input" unmountOnExit>
          <Input
            name="email"
            inputProps={{
              type: 'email',
              placeholder: 'Email',
            }}
          />
        </CSSTransition>
        <Input
          name="password"
          inputProps={{
            type: 'password',
            placeholder: 'Password',
          }}
        />
        <CSSTransition in={authMode === 'signup'} timeout={300} classNames="login-input" unmountOnExit>
          <Input
            name="repeatPassword"
            inputProps={{
              type: 'password',
              placeholder: 'Repeat password',
            }}
          />
        </CSSTransition>
        <button
          type="submit"
          className="focus:outline-none hover:bg-indigo-300 hover:text-indigo-50 click:bg-indigo-400 rounded-md bg-indigo-100 py-2 mt-1 mb-3 text-lg text-indigo-600"
        >
          {authMode === 'signin' ? 'Log In' : 'Register'}
        </button>
        <div className="flex justify-between">
          <span onClick={handleMode} role="button" className="text-gray-400 select-none">
            {authMode === 'signin' ? 'Create an account' : 'Have an account'}
          </span>
          <span role="button" className="text-gray-400 select-none">
            Forgot password
          </span>
        </div>
        {loading && <LoadingOverlay />}
      </Form>
    </Formik>
  );
};

export default AuthForm;
