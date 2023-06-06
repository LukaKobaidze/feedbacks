import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FeedbacksDataType } from 'types';
import { currentUserData } from 'data';
import { findFeedbackById, getTotalComments } from 'helpers';
import { Feedback, GoBack, Heading } from 'components';
import Comment from 'components/Comment';
import AddComment from 'components/AddComment';
import buttonStyles from 'styles/Button.module.scss';
import styles from 'styles/FeedbackDetail.module.scss';

interface Props {
  data: FeedbacksDataType;
  upvoted: number[];
  onUpvote: (id: number) => void;
  onCommentAdd: (
    feedbackId: number,
    content: string,
    commentId?: number,
    replyingTo?: string
  ) => void;
  onCommentEdit: (
    feedbackId: number,
    commentId: number,
    content: string,
    replyIndex?: number
  ) => void;
  onCommentDelete: (
    feedbackId: number,
    commentId: number,
    replyIndex?: number
  ) => void;
}

export default function FeedbackDetail(props: Props) {
  const { data, upvoted, onUpvote, onCommentAdd, onCommentEdit, onCommentDelete } =
    props;

  const { feedbackId } = useParams();
  const feedbackData = useMemo(() => {
    return findFeedbackById(Number(feedbackId), data);
  }, [feedbackId, data]);

  const commentsCount = getTotalComments(feedbackData?.comments);

  useEffect(() => {
    document.title = `${feedbackData?.title || 'Details'} | Product Feedback`;
  }, [feedbackData?.title]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <GoBack to={feedbackData?.status === 'Suggestion' ? '/' : '/roadmap'} />
        <Link
          to="edit"
          className={`${buttonStyles.button} ${buttonStyles['button--1']} ${styles['anchor-edit']}`}
        >
          Edit Feedback
        </Link>
      </header>
      <main>
        {feedbackData ? (
          <div>
            <Feedback
              isUpvoted={upvoted.includes(feedbackData.id)}
              onUpvote={onUpvote}
              tabIndex={-1}
              {...feedbackData}
              status={feedbackData.status}
            />

            {commentsCount !== 0 && (
              <div className={`element-rounded ${styles.comments}`}>
                <Heading level="2" className={styles['comments__heading']}>
                  {commentsCount} Comments
                </Heading>

                <ul className={styles['comments__list']}>
                  {feedbackData.comments!.map((comment) => {
                    const isMyComment =
                      comment.user.username === currentUserData.username;

                    return (
                      <li key={comment.id} className={styles.comment}>
                        <Comment
                          user={comment.user}
                          content={comment.content}
                          onReply={(content) =>
                            onCommentAdd(
                              feedbackData.id,
                              content,
                              comment.id,
                              comment.user.username
                            )
                          }
                          onDelete={
                            isMyComment
                              ? () => onCommentDelete(feedbackData.id, comment.id)
                              : undefined
                          }
                          onEdit={
                            isMyComment
                              ? (content) =>
                                  onCommentEdit(feedbackData.id, comment.id, content)
                              : undefined
                          }
                        />

                        {comment.replies && comment.replies.length !== 0 && (
                          <ul className={styles.replies}>
                            {comment.replies.map((reply, replyIndex) => {
                              const isMyReply =
                                reply.user.username === currentUserData.username;

                              return (
                                <li key={replyIndex} className={styles.reply}>
                                  <Comment
                                    user={reply.user}
                                    content={reply.content}
                                    replyingTo={reply.replyingTo}
                                    onReply={(content) =>
                                      onCommentAdd(
                                        feedbackData.id,
                                        content,
                                        comment.id,
                                        reply.user.username
                                      )
                                    }
                                    onDelete={
                                      isMyReply
                                        ? () =>
                                            onCommentDelete(
                                              feedbackData.id,
                                              comment.id,
                                              replyIndex
                                            )
                                        : undefined
                                    }
                                    onEdit={
                                      isMyReply
                                        ? (content) =>
                                            onCommentEdit(
                                              feedbackData.id,
                                              comment.id,
                                              content,
                                              replyIndex
                                            )
                                        : undefined
                                    }
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className={`element-rounded ${styles['add-comment']}`}>
              <Heading level="2" className={styles['add-comment__heading']}>
                Add Comment
              </Heading>
              <AddComment
                onSubmit={(content) => onCommentAdd(feedbackData.id, content)}
              />
            </div>
          </div>
        ) : (
          <div>404 Not Found.</div>
        )}
      </main>
    </div>
  );
}
