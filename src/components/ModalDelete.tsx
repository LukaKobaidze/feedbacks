import Button from './Button';
import Heading from './Heading';
import Modal from './Modal';
import styles from 'styles/ModalDelete.module.scss';
import Text from './Text';

interface Props {
  heading: string;
  paragraph: string;
  onCloseModal: () => void;
  onDelete: () => void;
  elementDeleting?: React.ReactNode;
}

export default function ModalDelete(props: Props) {
  const { heading, paragraph, onCloseModal, onDelete, elementDeleting } = props;

  return (
    <Modal onCloseModal={onCloseModal} className={styles['delete-modal']}>
      <Heading level="2">{heading}</Heading>
      <Text tag="p" variant="1">
        {paragraph}
      </Text>
      {elementDeleting && (
        <div className={`element-rounded ${styles.element}`}>{elementDeleting}</div>
      )}
      <div className={styles.buttons}>
        <Button variant="3" onClick={() => onCloseModal()} className={styles.btn}>
          Cancel
        </Button>
        <Button variant="4" onClick={() => onDelete()} className={styles.btn}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
