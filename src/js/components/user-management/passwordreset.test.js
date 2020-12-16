import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import PasswordReset, { PasswordReset as PasswordResetComponent } from './passwordreset';
import { defaultState, undefineds } from '../../../../tests/mockData';

const mockStore = configureStore([thunk]);

describe('PasswordReset Component', () => {
  let store;
  beforeEach(() => {
    store = mockStore({ ...defaultState });
  });

  it('renders correctly', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <Provider store={store}>
          <PasswordReset match={{ params: { secretHash: '' } }} />
        </Provider>
      </MemoryRouter>
    );
    const view = baseElement.firstChild;
    expect(view).toMatchSnapshot();
    expect(view).toEqual(expect.not.stringMatching(undefineds));
  });

  it('works as intended', async () => {
    const submitCheck = jest.fn().mockResolvedValue();
    const snackbar = jest.fn();
    const secretHash = 'leHash';
    const ui = (
      <MemoryRouter>
        <PasswordResetComponent match={{ params: { secretHash } }} passwordResetComplete={submitCheck} setSnackbar={snackbar} />
      </MemoryRouter>
    );
    const { rerender } = render(ui);

    await userEvent.type(screen.queryByLabelText(/Password \*/), 'mysecretpassword!123', { delay: 30 });
    userEvent.type(screen.queryByLabelText(/confirm password \*/i), 'mysecretpassword!');
    userEvent.click(screen.getByRole('button', { name: /Save password/i }));
    expect(snackbar).toHaveBeenCalledWith('The passwords you provided do not match, please check again.', 5000, '');
    userEvent.type(screen.queryByLabelText(/confirm password \*/i), '123');

    userEvent.click(screen.getByRole('button', { name: /Save password/i }));
    expect(submitCheck).toHaveBeenCalledWith(secretHash, 'mysecretpassword!123');

    await act(() => waitFor(() => rerender(ui)));
    expect(screen.queryByText(/Your password has been updated./i)).toBeInTheDocument();
  });
});
