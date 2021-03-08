import { FC, Fragment } from 'react';

import Image from 'next/image';

import AuthForm from 'components/login/AuthForm';

const Login: FC = () => {
  return (
    <Fragment>
      <div className="container px-10 flex items-center justify-center h-full mx-auto">
        <Image src="/illustrations/login.svg" className="pointer-events-none flex-1" alt="" width={700} height={700} />
        <AuthForm />
      </div>
    </Fragment>
  );
};

export default Login;
