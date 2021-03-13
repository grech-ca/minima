import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';

import { setModal, ModalName } from 'ducks/modal/modalSlice';

interface UseModalHookResult {
  closeModal: () => void;
  openModal: (modalName: ModalName) => void;
  isActiveModal: (modalName: ModalName) => boolean;
}

type UseModalHook = () => UseModalHookResult;

const useModal: UseModalHook = () => {
  const { modal } = useAppSelector(state => state.modal);

  const dispatch = useAppDispatch();

  const closeModal = () => dispatch(setModal(null));
  const openModal = (modalName: ModalName) => dispatch(setModal(modalName));
  const isActiveModal = (modalName: ModalName) => modalName && modalName === modal;

  return {
    closeModal,
    openModal,
    isActiveModal,
  };
};

export default useModal;
