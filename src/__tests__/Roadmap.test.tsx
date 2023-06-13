import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Route, Router, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { feedbacksData } from 'data';
import { Roadmap } from 'pages';

describe('<Roadmap /> page', () => {
  afterAll(cleanup);

  const history = createMemoryHistory({ initialEntries: ['/', '/roadmap'] });

  const onFeedbackUpvote = jest.fn();

  it('Should render page', () => {
    render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route
            path="/roadmap"
            element={
              <Roadmap data={feedbacksData} onFeedbackUpvote={onFeedbackUpvote} />
            }
          />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Roadmap')).toBeInTheDocument();
  });

  it("Should render 'Planned', 'In-Progress', 'Live' statuses with feedback count", () => {
    expect(
      screen.getByText(`Planned (${feedbacksData.Planned.length})`)
    ).toBeInTheDocument();

    expect(
      screen.getByText(`In-Progress (${feedbacksData['In-Progress'].length})`)
    ).toBeInTheDocument();

    expect(
      screen.getByText(`Live (${feedbacksData.Live.length})`)
    ).toBeInTheDocument();
  });

  it('Should call onFeedbackUpvote function on upvote click', () => {
    fireEvent.click(screen.getAllByLabelText('upvote')[0]);

    expect(onFeedbackUpvote).toHaveBeenCalledTimes(1);
  });

  it("Should update url pathname, on 'Go Back' click", () => {
    fireEvent.click(screen.getByLabelText('go back'));

    expect(history.location.pathname).toBe('/');
  });
});
