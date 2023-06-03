import { useState, useRef } from 'react';
import { UserType } from 'types';
import Text from './Text';
import Heading from './Heading';
import AddComment from './AddComment';
import styles from 'styles/Comment.module.scss';
import Modal from './Modal';
import Button from './Button';
import ModalDelete from './ModalDelete';

type ActionType = 'reply' | 'edit' | 'delete' | null;

interface Props {
  user: UserType;
  content: string;
  replyingTo?: string;
  onReply?: (content: string) => void;
  onEdit?: (content: string) => void;
  onDelete?: () => void;
  imageGap?: number;
  textContentGap?: number;
  className?: string;
}

export default function Comment(props: Props) {
  const {
    user,
    content,
    onReply,
    onEdit,
    onDelete,
    replyingTo,
    imageGap,
    textContentGap,
    className,
  } = props;

  const [action, setAction] = useState<ActionType>(null);
  const [textareaHeight, setTextareaHeight] = useState<number>(80);
  const commentTextRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const handleToggleAction = (param: ActionType) => {
    if (param === null) return;

    setAction((state) => {
      if (commentTextRef.current && param === 'edit' && state === null) {
        setTextareaHeight(commentTextRef.current.clientHeight + 35 || 80);
        return 'edit';
      }

      return state === param ? null : param;
    });
  };

  return (
    <div className={className}>
      <div className={styles.comment}>
        <div
          className={styles['image-wrapper']}
          style={imageGap ? { marginRight: imageGap } : undefined}
        >
          <img
            src={require(`../${user.image}`)}
            alt={user.username}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <div
            className={styles['name-and-controls']}
            style={textContentGap ? { marginBottom: textContentGap } : undefined}
          >
            <div className={styles.text}>
              <Heading level="3" styleLevel="4">
                {user.name}
              </Heading>
              <p className={styles.username}>@{user.username}</p>
            </div>
            <div>
              {onEdit && (
                <button
                  className={`${styles['control-btn']} ${styles['control-btn--edit']}`}
                  onClick={() => handleToggleAction('edit')}
                >
                  {action === 'edit' ? 'Cancel' : 'Edit'}
                </button>
              )}

              {onDelete && (
                <button
                  className={`${styles['control-btn']} ${styles['control-btn--delete']}`}
                  onClick={() => handleToggleAction('delete')}
                >
                  Delete
                </button>
              )}

              {onReply && (
                <button
                  className={`${styles['control-btn']} ${styles['control-btn--reply']}`}
                  onClick={() => handleToggleAction('reply')}
                >
                  {action === 'reply' ? 'Cancel' : 'Reply'}
                </button>
              )}
            </div>
          </div>

          {action === 'edit' ? (
            <AddComment
              contentInitial={content}
              replyingTo={replyingTo}
              editing
              initialFocus
              onSubmit={(content) => {
                onEdit && onEdit(content);
                setAction(null);
              }}
              fieldStyle={{ height: textareaHeight }}
            />
          ) : (
            <div ref={commentTextRef}>
              <Text tag="p" variant="2" className={styles['text-content']}>
                {replyingTo && (
                  <span className={styles['replying-to']}>@{replyingTo} </span>
                )}
                {content}
              </Text>
            </div>
          )}

          {action === 'reply' && (
            <AddComment
              replyingTo={user.username}
              onSubmit={(content) => {
                onReply && onReply(content);
                setAction(null);
              }}
              className={styles.reply}
              initialFocus
            />
          )}

          {action === 'delete' && (
            <ModalDelete
              heading={`Delete ${replyingTo ? 'Reply' : 'Comment'}`}
              paragraph={`Are you sure you want to delete this ${
                replyingTo ? ' reply' : ' comment'
              }?`}
              onCloseModal={() => setAction(null)}
              onDelete={() => onDelete && onDelete}
              elementDeleting={
                <div className={styles['modal-delete-element']}>
                  <Comment
                    user={user}
                    content={content}
                    replyingTo={replyingTo}
                    imageGap={20}
                    textContentGap={7}
                  />
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
