import { FC } from 'react';

import classnames from 'classnames';

import ReactModal from 'react-modal';

import useModal from 'hooks/useModal';

import { ModalName } from 'ducks/modal/modalSlice';

interface Props {
  name: ModalName;
  title?: string;
  className?: string;
}

const Modal: FC<Props> = ({ title, name, className, children }) => {
  const { isActiveModal, closeModal } = useModal();

  return (
    <ReactModal
      isOpen={isActiveModal(name)}
      onRequestClose={closeModal}
      shouldCloseOnEsc
      ariaHideApp={false}
      overlayClassName="fixed bg-black bg-opacity-60 inset-0 flex items-center justify-center"
      className={classnames('bg-white rounded-xl p-4 absolute overflow-auto focus:outline-none', className)}
    >
      <div className="flex justify-between items-center mb-5">
        {title && <span className="text-lg mr-5 text-gray-600">{title}</span>}
        <div className="flex-1" />
        <button
          onClick={closeModal}
          className="transition-colors flex hover:bg-gray-100 hover:text-gray-600 justify-center items-center border-none focus:outline-none bg-none text-2xl text-gray-400 w-7 h-7 rounded-md"
        >
          &times;
        </button>
      </div>
      <div className="overflow-y-auto h-auto">{children}</div>
    </ReactModal>
  );
};

export default Modal;
