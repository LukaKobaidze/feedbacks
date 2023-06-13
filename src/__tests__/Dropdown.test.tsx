import '@testing-library/jest-dom';
import '@testing-library/react/dont-cleanup-after-each';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Dropdown } from 'components';

describe('<Dropdown /> component', () => {
  afterAll(cleanup);

  const onSelect = jest.fn();

  it('Should render component', () => {
    render(
      <Dropdown
        items={[
          { value: 'Profile' },
          { value: 'Settings' },
          { value: 'Sign Out', color: 'red' },
        ]}
        onSelect={onSelect}
      >
        User
      </Dropdown>
    );

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('Should show/hide dropdown on button click', () => {
    const button = screen.getByText('User');

    expect(screen.queryByLabelText('dropdown')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByLabelText('dropdown')).toBeInTheDocument();
  });

  it('Should hide dropdown on outside click', () => {
    render(<button>outside button</button>);

    expect(screen.getByLabelText('dropdown')).toBeInTheDocument();

    fireEvent.click(screen.getByText('outside button'));

    expect(screen.queryByLabelText('dropdown')).not.toBeInTheDocument();
  });

  it('Should hide dropdown on `Escape` keyDown', () => {
    const button = screen.getByText('User');

    fireEvent.click(button);

    expect(screen.getByLabelText('dropdown')).toBeInTheDocument();

    fireEvent.keyDown(button, { key: 'Escape' });

    expect(screen.queryByLabelText('dropdown')).not.toBeInTheDocument();
  });

  it('Should select item in dropdown menu', () => {
    fireEvent.click(screen.getByText('User'));
    fireEvent.click(screen.getByText('Sign Out'));

    expect(onSelect.mock.calls[0][0]).toBe('Sign Out');
  });

  it('Should hide dropdown menu after selecting item', () => {
    expect(screen.queryByLabelText('dropdown')).not.toBeInTheDocument();
  });
});
