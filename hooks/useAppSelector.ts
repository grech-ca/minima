import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from 'startup/redux';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
