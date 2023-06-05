import { forwardRef } from 'react';
import styles from 'styles/Field.module.scss';

type Props = { error?: string } & (
  | ({
      type: 'textarea';
      fieldRef?: React.RefObject<HTMLTextAreaElement>;
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({
      type: 'text';
      fieldRef?: React.RefObject<HTMLInputElement>;
    } & React.InputHTMLAttributes<HTMLInputElement>)
);
type Ref = HTMLInputElement | HTMLTextAreaElement;

export default forwardRef<Ref, Props>(function Field(props, ref) {
  const renderField = () => {
    if (props.type === 'textarea') {
      const { className, error, fieldRef, ...restProps } = props;

      return (
        <textarea
          ref={fieldRef}
          className={`${styles.field} ${error ? styles.error : ''} ${className}`}
          {...restProps}
        />
      );
    }

    const { className, error, fieldRef, ...restProps } = props;
    return (
      <input
        ref={fieldRef}
        className={`${styles.field} ${error ? styles.error : ''} ${className}`}
        {...restProps}
      />
    );
  };

  const { error } = props;

  return (
    <div className={styles['field-wrapper']}>
      {renderField()}
      {error && <span className={styles['error-text']}>{error}</span>}
    </div>
  );
});
