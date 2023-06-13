import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { feedbacksData } from 'data';
import { Feedback } from 'components';

describe('<Feedback /> component', () => {
  afterAll(cleanup);

  let rerender: (
    ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  ) => void;

  const feedbackData = feedbacksData.Suggestion[0];

  it('Should render component', () => {
    rerender = render(<Feedback {...feedbackData} />).rerender;

    expect(screen.getByText(feedbackData.title)).toBeInTheDocument();
    expect(screen.getByText(feedbackData.description)).toBeInTheDocument();
    expect(screen.getByText(feedbackData.category)).toBeInTheDocument();
    expect(screen.getByText(feedbackData.upvotes)).toBeInTheDocument();
  });

  it('Should disable upvote, if onUpvote not handled', () => {
    expect(screen.getByLabelText('upvote')).toBeDisabled();
  });

  const onUpvote = jest.fn();
  it('Should call onUpvote function on button click', () => {
    rerender(<Feedback {...feedbackData} onUpvote={onUpvote} />);

    fireEvent.click(screen.getByLabelText('upvote'));

    expect(onUpvote).toHaveBeenCalledTimes(1);
  });

  it('Should increment upvote number by one, if upvoted', () => {
    rerender(<Feedback {...feedbackData} isUpvoted />);

    expect(screen.getByText(feedbackData.upvotes + 1)).toBeInTheDocument();
  });
});
