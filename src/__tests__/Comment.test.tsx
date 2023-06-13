import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { currentUserData } from 'data';
import { Comment } from 'components';

describe('<Comment /> component', () => {
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

  it('Should call onReply function on button click', () => {
    const replyText = 'some reply text!';

    fireEvent.click(screen.getByText('Reply'));
    fireEvent.change(screen.getByPlaceholderText(/^Reply to @/), {
      target: { value: replyText },
    });
    fireEvent.click(screen.getByText('Post Reply'));

    expect(onReply.mock.calls[0][0]).toBe(replyText);
  });

  it('Should call onEdit function on button click', () => {
    const commentAfterEdit = 'edited comment text!';

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByDisplayValue(initialCommentContent), {
      target: { value: commentAfterEdit },
    });
    fireEvent.click(screen.getByText(/^Update/));

    expect(onEdit.mock.calls[0][0]).toBe(commentAfterEdit);
  });

  it('Should call onDelete function on confirm click', () => {
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
