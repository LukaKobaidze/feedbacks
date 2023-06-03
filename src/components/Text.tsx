import styles from 'styles/Text.module.scss';

interface Props
  extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  tag: 'span' | 'p';
  variant: '1' | '2' | '3';
}

export default function Text(props: Props) {
  const { tag, variant, className, children, ...restProps } = props;

  const TextDynamic: keyof JSX.IntrinsicElements = tag;

  return (
    <TextDynamic
      className={`${styles.text} ${styles[`text--${variant}`]} ${className}`}
      {...restProps}
    >
      {children}
    </TextDynamic>
  );
}
