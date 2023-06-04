import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home, FeedbackDetail, FeedbackEdit, FeedbackNew, Roadmap } from 'pages';
import { useFeedbacks } from 'hooks';

export default function App() {
  const { pathname } = useLocation();
  const {
    feedbacks,
    upvoted,
    sortBy,
    onFeedbackUpvote,
    onFeedbackDelete,
    onCommentAdd,
    onCommentEdit,
    onCommentDelete,
  } = useFeedbacks();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            feedbacksData={feedbacks}
            sortBy={sortBy}
            upvoted={upvoted}
            onFeedbackUpvote={onFeedbackUpvote}
          />
        }
      />
      <Route path="/roadmap" element={<Roadmap data={feedbacks} />} />\
      <Route path="/new" element={<FeedbackNew />} />
      <Route
        path="/:feedbackId/edit"
        element={
          <FeedbackEdit
            data={feedbacks}
            upvoted={upvoted}
            onDelete={onFeedbackDelete}
            onSaveChanges={() => {}}
          />
        }
      />
      <Route
        path="/:feedbackId"
        element={
          <FeedbackDetail
            data={feedbacks}
            upvoted={upvoted}
            onUpvote={onFeedbackUpvote}
            onCommentAdd={onCommentAdd}
            onCommentEdit={onCommentEdit}
            onCommentDelete={onCommentDelete}
          />
        }
      />
    </Routes>
  );
}
