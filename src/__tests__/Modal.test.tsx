import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Modal } from 'components';

describe('<Modal /> component', () => {
  afterAll(cleanup);

  const onCloseModal = jest.fn();

  it('Should render component and its children elements', () => {
    render(
      <Modal onCloseModal={onCloseModal} aria-label="modal">
        <button>children button</button>
      </Modal>
    );

    expect(screen.getByLabelText('modal')).toBeInTheDocument();
    expect(screen.getByText('children button')).toBeInTheDocument();
  });

  it('Should close modal on backdrop mouseDown', () => {
    fireEvent.mouseDown(screen.getByLabelText('backdrop'));

    expect(onCloseModal).toHaveBeenCalledTimes(1);
  });

  it('Should close modal on `Escape` keyDown', () => {
    fireEvent.keyDown(screen.getByText('children button'), { key: 'Escape' });

    expect(onCloseModal).toHaveBeenCalledTimes(1);
  });
});
