import { FC, useState, useCallback, Fragment } from 'react';

import Image from 'next/image';

import { CSSTransition } from 'react-transition-group';

type AuthMode = 'signin' | 'signup';

const Login: FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  const handleMode = useCallback(() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup'), [authMode]);

  return (
    <Fragment>
      <div className="container px-10 flex items-center justify-center h-full mx-auto">
        <Image src="/svg/login.svg" className="pointer-events-none flex-1" alt="" width={700} height={700} />
        <div className="flex flex-col bg-white rounded-xl ml-10 px-10 py-16">
          <h1 className="text-4xl font-black mb-12 text-gray-700 text-center mx-10">Join Minima flow</h1>
          <form className="flex flex-col flex-1 mb-3">
            <input
              autoFocus
              type="text"
              placeholder={authMode === 'signup' ? 'Name or email' : 'Name'}
              className="bg-gray-50 outline-none rounded-md text-lg mb-4 py-2 px-4 focus:ring-2 focus:ring-indigo-500"
            />
            <CSSTransition in={authMode === 'signin'} timeout={300} classNames="login-input" unmountOnExit>
              <input
                type="email"
                placeholder="Email"
                className="bg-gray-50 outline-none rounded-md text-lg mb-4 py-2 px-4 focus:ring-2 focus:ring-indigo-500"
              />
            </CSSTransition>
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-50 outline-none rounded-md text-lg mb-4 py-2 px-4 focus:ring-2 focus:ring-indigo-500"
            />
            <CSSTransition in={authMode === 'signin'} timeout={300} classNames="login-input" unmountOnExit>
              <input
                type="password"
                placeholder="Repeat password"
                className="bg-gray-50 outline-none rounded-md text-lg mb-4 py-2 px-4 focus:ring-2 focus:ring-indigo-500"
              />
            </CSSTransition>
            <button className="rounded-md bg-indigo-100 py-2 mt-1 mb-3 text-lg text-indigo-700 focus:ring-2 focus:ring-indigo-500">
              {authMode === 'signup' ? 'Log In' : 'Register'}
            </button>
          </form>
          <div className="flex justify-between">
            <span onClick={handleMode} role="button" className="text-gray-400 select-none">
              {authMode === 'signin' ? 'Create an account' : 'Have an account'}
            </span>
            <span role="button" className="text-gray-400 select-none">
              Forgot password
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        button {
          outline: none !important;
        }
      `}</style>
    </Fragment>
  );
};

export default Login;
