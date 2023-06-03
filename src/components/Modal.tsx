import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { AlertOutsideClick } from 'components';
import styles from 'styles/Modal.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onCloseModal: () => void;
  ignoreKeyboardEscape?: boolean;
  initialFocus?: boolean;
}

export default function Modal(props: Props) {
  const {
    onCloseModal,
    ignoreKeyboardEscape,
    initialFocus,
    className,
    children,
    ...restProps
  } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseModal();
      }
    };

    if (ignoreKeyboardEscape) {
      document.removeEventListener('keydown', handleKeyDown);
    } else {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ignoreKeyboardEscape, onCloseModal]);

  return createPortal(
    <FocusTrap
      focusTrapOptions={initialFocus === false ? { initialFocus } : undefined}
    >
      <div className={styles['wrapper-backdrop']}>
        <AlertOutsideClick
          event="mousedown"
          onOutsideClick={onCloseModal}
          className={`element-rounded ${styles.modal} ${className}`}
          {...restProps}
        >
          {children}
        </AlertOutsideClick>
      </div>
    </FocusTrap>,
    document.body
  );
}
