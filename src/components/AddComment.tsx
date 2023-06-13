import { useEffect, useRef, useState } from 'react';
import { Field, Button, Text } from 'components';
import styles from 'styles/AddComment.module.scss';

const MAX_CHARS = 250;

interface Props {
  onSubmit: (content: string) => void;
  contentInitial?: string;
  replyingTo?: string;
  initialFocus?: boolean;
  editing?: boolean;
  className?: string;
  fieldStyle?: React.CSSProperties;
}

export default function AddComment(props: Props) {
  const {
    onSubmit,
    replyingTo,
    contentInitial,
    editing,
    initialFocus,
    className,
    fieldStyle,
  } = props;

  const [content, setContent] = useState(contentInitial || '');
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const charsLeft = MAX_CHARS - content.length;

  useEffect(() => {
    const element = fieldRef.current;
    if (!element) return;
    element.setSelectionRange(element.value.length, element.value.length);
  }, [initialFocus]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_CHARS) return;

    setContent(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content.trim().length === 0) {
      fieldRef.current?.focus();
    } else {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form
      className={`${styles.container} ${
        styles[`container--${editing || !replyingTo ? '1' : '2'}`]
      } ${className}`}
      onSubmit={handleSubmit}
    >
      <Field
        type="textarea"
        value={content}
        className={styles.field}
        onChange={handleFieldChange}
        placeholder={
          replyingTo ? `Reply to @${replyingTo}` : 'Type your comment here'
        }
        autoFocus={initialFocus}
        fieldRef={fieldRef}
        style={fieldStyle}
      />
      <div className={styles['button-wrapper']}>
        {!replyingTo && (
          <Text tag="span" variant="2" className={styles['chars-left']}>
            {charsLeft} characters left
          </Text>
        )}
        <Button variant="1" type="submit">
          {(editing ? 'Update' : 'Post') + (!replyingTo ? ' Comment' : ' Reply')}
        </Button>
      </div>
    </form>
  );
}
