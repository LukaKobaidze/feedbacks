import { IconArrowLeft } from 'assets/shared';
import { useNavigate } from 'react-router-dom';
import buttonStyles from 'styles/Button.module.scss';
import styles from 'styles/GoBack.module.scss';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function GoBack(props: Props) {
  const { className, onClick, ...restProps } = props;

  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(-1);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${buttonStyles.button} ${styles.container} ${className}`}
      onClick={handleClick}
      aria-label='go back'
      {...restProps}
    >
      <IconArrowLeft className={styles.icon} />
      <span>Go Back</span>
    </button>
  );
}
