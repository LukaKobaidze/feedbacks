import { IconArrowLeft } from 'assets/shared';
import { Link, LinkProps } from 'react-router-dom';
import buttonStyles from 'styles/Button.module.scss';
import styles from 'styles/GoBack.module.scss';

interface Props extends LinkProps {
  variant: '1' | '2';
}

export default function GoBack(props: Props) {
  const { className, ...restProps } = props;

  return (
    <Link
      className={`${buttonStyles.button} ${styles.container} ${className}`}
      {...restProps}
    >
      <IconArrowLeft className={styles.icon} />
      <span>Go Back</span>
    </Link>
  );
}
