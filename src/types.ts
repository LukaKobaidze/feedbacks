import { arrSortBy, categories } from 'data';

export type FeedbacksDataType = {
  Suggestion: FeedbackType[];
  Planned: FeedbackType[];
  'In-Progress': FeedbackType[];
  Live: FeedbackType[];
};

export type FeedbackType = {
  id: number;
  title: string;
  category: CategoryType;
  upvotes: number;
  description: string;
  comments?: CommentType[];
};

export type UserType = {
  image: string;
  name: string;
  username: string;
};

export type CommentType = {
  id: number;
  content: string;
  user: UserType;
  replies?: ReplyType[];
};

export type ReplyType = {
  content: string;
  user: UserType;
  replyingTo: string;
};

export type CategoryType = (typeof categories)[number];

export type SortByType = (typeof arrSortBy)[number];
