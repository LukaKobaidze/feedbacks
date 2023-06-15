import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home, FeedbackDetail, FeedbackEdit, FeedbackNew, Roadmap } from 'pages';
import { useFeedbacks, useWindowDimensions } from 'hooks';

export default function App() {
  const { pathname } = useLocation();
  const {
    feedbacks,
    upvoted,
    sortBy,
    onFeedbackAdd,
    onFeedbackEdit,
    onFeedbackUpvote,
    onFeedbackDelete,
    onCommentAdd,
    onCommentEdit,
    onCommentDelete,
  } = useFeedbacks();
  const [windowWidth] = useWindowDimensions();

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
            windowWidth={windowWidth}
          />
        }
      />
      <Route
        path="/roadmap"
        element={
          <Roadmap
            data={feedbacks}
            upvoted={upvoted}
            onFeedbackUpvote={onFeedbackUpvote}
            windowWidth={windowWidth}
          />
        }
      />
      <Route path="/new" element={<FeedbackNew onSubmit={onFeedbackAdd} />} />
      <Route
        path="/:feedbackId/edit"
        element={
          <FeedbackEdit
            data={feedbacks}
            upvoted={upvoted}
            onDelete={onFeedbackDelete}
            onSaveChanges={onFeedbackEdit}
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
