import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Confirm from './confirm';
import { undefineds } from '../../../../tests/mockData';

describe('Confirm Component', () => {
  it('renders correctly', () => {
    const { baseElement } = render(<Confirm type="abort" />);
    const view = baseElement.firstChild.firstChild;
    expect(view).toMatchSnapshot();
    expect(view).toEqual(expect.not.stringMatching(undefineds));
  });

  it('works as intended', async () => {
    const actionCheck = jest.fn();
    const cancelCheck = jest.fn();

    const { container } = render(<Confirm type="chartRemoval" action={actionCheck} cancel={cancelCheck} />);

    expect(screen.queryByText(/remove this chart\?/i)).toBeInTheDocument();
    userEvent.click(container.querySelector('.green'));
    expect(actionCheck).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/removing/i)).toBeInTheDocument();
    userEvent.click(container.querySelector('.red'));
    expect(cancelCheck).toHaveBeenCalledTimes(1);
  });
});
