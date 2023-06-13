import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Router, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { SortByType } from 'types';
import { feedbacksData } from 'data';
import { Home } from 'pages';

describe('<Home /> page', () => {
  afterAll(cleanup);

  const history = createMemoryHistory({
    initialEntries: ['/'],
  });

  const onFeedbackUpvote = jest.fn();

  it('Should render page', () => {
    render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                feedbacksData={{
                  Suggestion: feedbacksData.Suggestion,
                  Planned: [],
                  'In-Progress': [],
                  Live: [],
                }}
                sortBy="Most Upvotes"
                onFeedbackUpvote={onFeedbackUpvote}
              />
            }
          />
        </Routes>
      </Router>
    );

    expect(screen.getByLabelText('header')).toBeInTheDocument();
    expect(screen.getByLabelText('main')).toBeInTheDocument();
  });

  it('Should count suggestions', () => {
    expect(
      screen.getByText(`${feedbacksData.Suggestion.length} Suggestions`)
    ).toBeInTheDocument();
  });

  it('Should update search queries on category click', () => {
    const categories = within(screen.getByLabelText('categories'));

    userEvent.click(categories.getByText('Bug'));

    expect(history.location.search).toBe('?categories=Bug');
  });

  it("Should update search queries on 'Sort By' change", () => {
    fireEvent.click(screen.getByLabelText('sort by'));
    fireEvent.click(screen.getByDisplayValue('Least Upvotes' as SortByType));

    expect(history.location.search).toBe('?categories=Bug&sortBy=Least+Upvotes');
  });

  it("Should disable Roadmap's 'View' button, if roadmap is empty (no feedbacks)", () => {
    const roadmap = within(screen.getByLabelText('roadmap'));

    expect(roadmap.getByText('View')).toHaveAttribute('aria-disabled', 'true');
  });
});
