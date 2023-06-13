import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Route, Router, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { CategoryType } from 'types';
import { FeedbackNew } from 'pages';

describe('<FeedbackNew /> page', () => {
  afterAll(cleanup);

  const history = createMemoryHistory({
    initialEntries: [`/new`],
  });

  const onSubmit = jest.fn(
    (title: string, category: CategoryType, description: string) => {}
  );

  it('Should render page', () => {
    render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="/new" element={<FeedbackNew onSubmit={onSubmit} />} />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Create New Feedback')).toBeInTheDocument();
  });

  it('Should call onSubmit function with valid arguments, on form submit', () => {
    const title = 'Feedback Title';
    const category: CategoryType = 'Enhancement';
    const description = 'Nice feedback description.';

    fireEvent.change(screen.getByLabelText('title field'), {
      target: { value: title },
    });

    fireEvent.click(screen.getByLabelText('category select'));
    fireEvent.click(screen.getByText(category));

    fireEvent.change(screen.getByLabelText('description field'), {
      target: { value: description },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add Feedback' }));

    const [argTitle, argCategory, argDescription] = onSubmit.mock.calls[0];

    expect(argTitle).toBe(title);
    expect(argCategory).toBe(category);
    expect(argDescription).toBe(description);
  });

  it('Should update url pathname on Cancel button click', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(history.location.pathname).toBe('/');
  });
});
