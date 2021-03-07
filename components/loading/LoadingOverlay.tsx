import { FC } from 'react';

import Spinner from 'components/loading/Spinner';

const LoadingOverlay: FC = () => (
  <div className="flex items-center justify-center h-full w-full bg-white bg-opacity-90 absolute top-0 left-0">
    <Spinner />
  </div>
);

export default LoadingOverlay;
