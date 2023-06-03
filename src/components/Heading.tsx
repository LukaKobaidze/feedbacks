import styles from 'styles/Heading.module.scss';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  level: '1' | '2' | '3' | '4';
  styleLevel?: '1' | '2' | '3' | '4';
}

export default function Heading(props: Props) {
  const { level, styleLevel = level, className, children, ...restProps } = props;

  const HeadingDynamic: keyof JSX.IntrinsicElements = `h${level}`;

  return (
    <HeadingDynamic
      className={`${styles.heading} ${
        styles[`heading--${styleLevel}`]
      } ${className}`}
      {...restProps}
    >
      {children}
    </HeadingDynamic>
  );
}
