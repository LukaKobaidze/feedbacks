/* eslint-disable no-loop-func */

import { CommentType, FeedbackType, FeedbacksDataType } from 'types';

export function getTotalComments(comments: CommentType[] | undefined): number {
  if (!comments) return 0;

  return comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);
}

export function findFeedbackById(
  id: number,
  data: FeedbacksDataType
): FeedbackType | null {
  return (
    [...data.Suggestion, ...data.Planned, ...data['In-Progress'], ...data.Live].find(
      (feedback) => feedback.id === id
    ) || null
  );
}

export function findFeedbackByIdAndReplace(
  id: number,
  data: FeedbacksDataType,
  replace: (feedback: FeedbackType) => FeedbackType
): FeedbacksDataType {
  let output: FeedbacksDataType = {
    Suggestion: [],
    Planned: [],
    'In-Progress': [],
    Live: [],
  };
  const keys = Object.keys(data) as (keyof FeedbacksDataType)[];

  let feedbackReplaced = false;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (feedbackReplaced) {
      output[key] = [...data[key]];
    } else {
      output[key] = data[key].map((feedback) => {
        if (feedback.id === id) {
          feedbackReplaced = true;
          return replace(feedback);
        }

        return feedback;
      });
    }
  }

  return output;
}

let latestId = 15;
export function getCommentId() {
  return ++latestId;
}
