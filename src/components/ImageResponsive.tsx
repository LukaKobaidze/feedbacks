interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  desktop: { path: string };
  tablet?: { path: string; breakpoint?: number };
  mobile?: { path: string; breakpoint?: number };
}

export default function ImageResponsive(props: Props) {
  const { desktop, tablet, mobile, className, alt, ...restProps } = props;

  return (
    <picture>
      {mobile && (
        <source
          srcSet={require(`../${mobile.path}`)}
          media={`(max-width: ${mobile.breakpoint || 375}px)`}
        />
      )}
      {tablet && (
        <source
          srcSet={require(`../${tablet.path}`)}
          media={`(max-width: ${tablet.breakpoint || 768}px)`}
        />
      )}
      <img
        src={require(`../${desktop.path}`)}
        className={`${className || ''}`}
        alt={alt || ''}
        {...restProps}
      />
    </picture>
  );
}
