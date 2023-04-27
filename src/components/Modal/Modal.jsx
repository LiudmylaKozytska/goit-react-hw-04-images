import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { Backdrop, ImageModal, Image } from './ModalStyle';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ largeImageURL, onClose }) {
  const handleKeyDown = useCallback(
    e => {
      if (e.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    e => {
      if (e.currentTarget === e.target) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return createPortal(
    <Backdrop onClick={handleBackdropClick}>
      <ImageModal>
        <Image src={largeImageURL} alt="Image" />
      </ImageModal>
    </Backdrop>,
    modalRoot
  );
}

Modal.prototype = {
  closeModal: PropTypes.func.isRequired,
  largeImage: PropTypes.string.isRequired,
};
