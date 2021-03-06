import { useDispatch } from 'react-redux';

import { AppDispatch } from 'startup/redux';

const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export default useAppDispatch;
