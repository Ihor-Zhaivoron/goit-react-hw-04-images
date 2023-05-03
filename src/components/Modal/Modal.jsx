import { useEffect } from 'react';
import css from './Modal.module.css';
import { createPortal } from 'react-dom';
import { CgCloseR } from 'react-icons/cg';

const modalRoot = document.querySelector('#modal_root');

export function Modal({ activeImg, onCloseModal }) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseModal]);

  function handleBackdropClick(e) {
    if (e.currentTarget === e.target) {
      onCloseModal();
    }
  }

  return createPortal(
    <div className={css.Overlay} onClick={handleBackdropClick}>
      <button type="button" className={css.Button} onClick={onCloseModal}>
        <CgCloseR />
      </button>
      <div className={css.Modal}>
        <img src={activeImg.largeImageURL} alt={activeImg.tags} />
      </div>
    </div>,
    modalRoot
  );
}
