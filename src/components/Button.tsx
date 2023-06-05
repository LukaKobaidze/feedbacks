import styles from 'styles/Button.module.scss';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  (
    | {
        variant?: '1' | '2' | '3' | '4';
        active?: boolean;
      }
    | { variant?: '5'; active: boolean }
  );

export default function Button(props: Props) {
  const { variant, className, children, active, ...restProps } = props;

  return (
    <button
      className={`${styles.button} ${variant ? styles[`button--${variant}`] : ''} ${
        variant === '5' && active ? styles.active : ''
      } ${className}`}
      type="button"
      {...restProps}
    >
      {children}
    </button>
  );
}
