import styles from 'styles/PageContainer.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function PageContainer(props: Props) {
  const { className, children, ...restProps } = props;

  return (
    <div className={`${styles.container} ${className}`} {...restProps}>
      {children}
    </div>
  );
}
