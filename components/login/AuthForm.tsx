import { FC, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

import * as yup from 'yup';

import { Formik, Form, FormikHelpers } from 'formik';
import { CSSTransition } from 'react-transition-group';

import Input from 'components/common/Input';
import LoadingOverlay from 'components/loading/LoadingOverlay';
import AvatarPicker from 'components/avatar/AvatarPicker';

import icons from 'data/avatars.json';
import colors from 'data/colors.json';

import { useLoginMutation, useRegisterMutation } from 'generated/graphql';

type AuthMode = 'signin' | 'signup';

interface FormValues {
  username: string;
  password: string;
  avatarIcon: string;
  avatarColor: string;
  email?: string;
  repeatPassword?: string;
}

const initialValues: FormValues = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
  avatarIcon: icons[Math.floor(Math.random() * icons.length)],
  avatarColor: colors[Math.floor(Math.random() * colors.length)],
};

const LoginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const RegisterSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(5),
  repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Password must match'),
});

const AuthForm: FC = () => {
  const router = useRouter();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);

  const handleMode = useCallback(() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup'), [authMode]);

  const handleSubmit = useCallback(
    (
      { username, email, password, avatarIcon, avatarColor }: FormValues,
      { resetForm, setErrors }: FormikHelpers<FormValues>,
    ) => {
      setIsLoading(true);

      const handleSuccess = (token?: string) => {
        localStorage.setItem('token', token);

        resetForm();
        void router.push('/');
      };

      if (authMode === 'signin') {
        void login({
          variables: {
            login: username,
            password,
          },
        })
          .then(({ data: { signin } }) => handleSuccess(signin?.authToken))
          .then(() => resetForm())
          .catch(console.error)
          .finally(() => setIsLoading(false));
      }

      void register({
        variables: {
          username,
          password,
          email,
          avatarIcon,
          avatarColor,
        },
      })
        .then(({ data: { signup } }) => handleSuccess(signup?.authToken))
        .catch(error => {
          const { extensions } = error.graphQLErrors[0] || {};

          if (extensions?.code === 'VALIDATION_SCHEMA_ERROR') {
            setErrors(extensions.validationErrors);
          }

          console.error(error);
        })
        .finally(() => setIsLoading(false));
    },
    [authMode, login, register, router],
  );

  return (
    <Formik
      validationSchema={authMode === 'signin' ? LoginSchema : RegisterSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 mb-3"
    >
      <Form className="flex flex-col relative bg-white rounded-xl ml-10 px-10 py-16">
        <h1 className="text-4xl font-black mb-12 text-gray-700 text-center mx-10">Join Minima flow</h1>
        <CSSTransition in={authMode === 'signup'} timeout={300} classNames="login-input" unmountOnExit>
          <AvatarPicker iconField="avatarIcon" colorField="avatarColor" />
        </CSSTransition>
        <Input
          name="username"
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
        {isLoading && <LoadingOverlay />}
      </Form>
    </Formik>
  );
};

export default AuthForm;
