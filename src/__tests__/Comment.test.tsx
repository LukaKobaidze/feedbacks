import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { currentUserData } from 'data';
import { Comment } from 'components';

describe('Comment component', () => {
  afterAll(cleanup);

  const onReply = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  let initialCommentContent = 'awesome!';

  it('Should render component', () => {
    render(
      <Comment
        user={currentUserData}
        content={initialCommentContent}
        onReply={onReply}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByLabelText('comment')).toBeInTheDocument();
  });

  it('Should call onReply function', () => {
    fireEvent.click(screen.getByText('Reply'));
    fireEvent.change(screen.getByPlaceholderText(/^Reply to @/), {
      target: { value: 'some reply text!' },
    });
    fireEvent.click(screen.getByText('Post Reply'));

    expect(onReply).toHaveBeenCalledTimes(1);
  });

  it('Should call onEdit function', () => {
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByDisplayValue(initialCommentContent), {
      target: { value: 'edited comment content!' },
    });
    fireEvent.click(screen.getByText(/^Update/));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('Should call onDelete function', () => {
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
