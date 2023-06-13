import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Route, Router, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { FeedbackType, FeedbacksDataType } from 'types';
import { feedbacksData } from 'data';
import { findFeedbackById } from 'helpers';
import { FeedbackEdit } from 'pages';

describe('<FeedbackEdit /> page', () => {
  afterAll(cleanup);

  const feedback = findFeedbackById(1, feedbacksData);

  if (!feedback) {
    throw new Error('Feedback data not found.');
  }

  const history = createMemoryHistory({
    initialEntries: [`/${feedback.id}/edit`],
  });

  const onDelete = jest.fn();
  const onSaveChanges = jest.fn(
    (
      edited: Omit<FeedbackType, 'comments' | 'upvotes'>,
      newStatus?: keyof FeedbacksDataType
    ) => {}
  );

  it('Should render page', () => {
    render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route
            path="/:feedbackId/edit"
            element={
              <FeedbackEdit
                data={feedbacksData}
                onSaveChanges={onSaveChanges}
                onDelete={onDelete}
              />
            }
          />
        </Routes>
      </Router>
    );

    expect(screen.getByText(`Editing '${feedback.title}'`)).toBeInTheDocument();
    expect(screen.getByDisplayValue(feedback.title)).toBeInTheDocument();
    expect(screen.getByText(feedback.category)).toBeInTheDocument();
    expect(screen.getByText(feedback.status)).toBeInTheDocument();
    expect(screen.getByDisplayValue(feedback.description)).toBeInTheDocument();
  });

  it('Should call onSaveChanges function with valid arguments, on edited form submit', () => {
    const edited: Omit<FeedbackType, 'comments' | 'upvotes'> = {
      id: feedback.id,
      title: 'I just edited this title!',
      category: 'Bug',
      description: 'Edited description!',
    };
    const newStatus: keyof FeedbacksDataType = 'Planned';

    fireEvent.change(screen.getByDisplayValue(feedback.title), {
      target: { value: edited.title },
    });

    fireEvent.click(screen.getByText(feedback.category));
    fireEvent.click(screen.getByText(edited.category));

    fireEvent.click(screen.getByText(feedback.status));
    fireEvent.click(screen.getByText(newStatus));

    fireEvent.change(screen.getByDisplayValue(feedback.description), {
      target: { value: edited.description },
    });

    fireEvent.click(screen.getByText('Save Changes'));

    const [argEdited, argNewStatus] = onSaveChanges.mock.calls[0];

    expect(argEdited).toMatchObject(edited);
    expect(argNewStatus).toBe(newStatus);
  });

  it('Should call onDelete function on button click', () => {
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Confirm'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('Should leave page on Cancel click', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(history.location.pathname).toBe(`/${feedback.id}`);
  });
});
