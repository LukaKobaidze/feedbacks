import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { currentUserData, feedbacksData as feedbacksDataInitial } from 'data';
import { FeedbacksDataType, SortByType } from 'types';
import { findFeedbackByIdAndReplace, getCommentId, getTotalComments } from 'helpers';

export default function useFeedbacks() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [feedbacks, setFeedbacks] = useState(feedbacksDataInitial);
  const [upvoted, setUpvoted] = useState<number[]>([]);
  const sortBy: SortByType = (searchParams.get('sortBy') ||
    'Most Upvotes') as SortByType;

  const onFeedbackUpvote = (id: number) => {
    setUpvoted((state) => {
      const removeIfExists = state.filter((loopId) => loopId !== id);

      return removeIfExists.length === state.length
        ? [...state, id]
        : removeIfExists;
    });
  };

  const onFeedbackDelete = (id: number) => {
    setFeedbacks((state) => {
      let output = { ...state };

      const keys = Object.keys(state) as (keyof FeedbacksDataType)[];

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const feedbacks = state[key];
        const indexFound = feedbacks.findIndex((feedback) => feedback.id === id);

        if (indexFound !== -1) {
          output[key] = [
            ...feedbacks.slice(0, indexFound),
            ...feedbacks.slice(indexFound + 1),
          ];
          break;
        }
      }

      return output;
    });

    navigate('/');
  };

  const onComment = (feedbackId: number, content: string) => {
    setFeedbacks((state) => {
      return findFeedbackByIdAndReplace(feedbackId, state, (feedback) => {
        return {
          ...feedback,
          comments: [
            ...(feedback.comments || []),
            { id: getCommentId(), content, user: currentUserData },
          ],
        };
      });
    });
  };

  const onReply = (
    feedbackId: number,
    commentId: number,
    replyingTo: string,
    content: string
  ) => {
    setFeedbacks((state) => {
      return findFeedbackByIdAndReplace(feedbackId, state, (feedback) => {
        if (!feedback.comments?.length) return feedback;

        return {
          ...feedback,
          comments: feedback.comments.map((comment) => {
            if (comment.id !== commentId) return comment;

            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                { content, replyingTo, user: currentUserData },
              ],
            };
          }),
        };
      });
    });
  };

  const onCommentEdit = (
    feedbackId: number,
    commentId: number,
    content: string,
    replyIndex?: number
  ) => {
    setFeedbacks((state) => {
      return findFeedbackByIdAndReplace(feedbackId, state, (feedback) => {
        let updatedComments = feedback.comments || [];

        if (replyIndex !== undefined) {
          updatedComments = updatedComments.map((comment) => {
            if (comment.id !== commentId || !comment.replies) return comment;

            return {
              ...comment,
              replies: [
                ...comment.replies.slice(0, replyIndex),
                { ...comment.replies[replyIndex], content },
                ...comment.replies.slice(replyIndex + 1),
              ],
            };
          });
        } else {
          updatedComments = updatedComments.map((comment) => {
            if (comment.id !== commentId) return comment;

            return {
              ...comment,
              content,
            };
          });
        }

        return {
          ...feedback,
          comments: updatedComments,
        };
      });
    });
  };

  const onCommentDelete = (
    feedbackId: number,
    commentId: number,
    replyIndex?: number
  ) => {
    setFeedbacks((state) => {
      return findFeedbackByIdAndReplace(feedbackId, state, (feedback) => {
        let updatedComments = feedback.comments || [];

        if (replyIndex !== undefined) {
          updatedComments = updatedComments.map((comment) => {
            if (comment.id !== commentId || !comment.replies) return comment;

            return {
              ...comment,
              replies: [
                ...comment.replies.slice(0, replyIndex),
                ...comment.replies.slice(replyIndex + 1),
              ],
            };
          });
        } else {
          updatedComments = updatedComments.filter(
            (comment) => comment.id !== commentId
          );
        }

        return {
          ...feedback,
          comments: updatedComments,
        };
      });
    });
  };

  useEffect(() => {
    setFeedbacks((state) => ({
      ...state,
      Suggestion: [...state.Suggestion].sort((a, b) => {
        switch (sortBy) {
          case 'Least Upvotes':
            return a.upvotes - b.upvotes;
          case 'Most Comments':
            return getTotalComments(b.comments) - getTotalComments(a.comments);
          case 'Least Comments':
            return getTotalComments(a.comments) - getTotalComments(b.comments);
          default: // Most Upvotes
            return b.upvotes - a.upvotes;
        }
      }),
    }));

    window.scrollTo(0, 0);
  }, [sortBy]);

  return {
    feedbacks,
    upvoted,
    sortBy,
    onFeedbackUpvote,
    onFeedbackDelete,
    onComment,
    onReply,
    onCommentEdit,
    onCommentDelete,
  };
}
