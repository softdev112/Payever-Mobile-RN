/**
 * Created by Elf on 12.01.2017.
 */
import startApp from '../src/startApp';
import AuthStore from '../src/store/AuthStore';
import { showScreen } from '../src/common/Navigation';

jest.mock('../src/common/Navigation');

describe('Test startApp function', () => {
  const mockGetAuth = jest.fn()
    .mockReturnValueOnce(null)
    .mockReturnValueOnce({ isLoggedIn: true })
    .mockReturnValueOnce({ isLoggedIn: false });

  beforeAll(() => {
    AuthStore.prototype.deserialize = mockGetAuth;
  });

  afterEach(() => {
    // Reset mock function
    mockGetAuth.mockClear();
    showScreen.mockClear();
  });

  it('If auth is null user should go to Login screen', async () => {
    await startApp();

    expect(mockGetAuth).toHaveBeenCalledTimes(1);
    expect(showScreen.mock.calls.length).toBe(1);
    expect(showScreen.mock.calls[0][0]).toBe('auth.Login');
  });

  it('If user logged in user should go to ChooseAccount screen', async () => {
    await startApp();

    expect(mockGetAuth).toHaveBeenCalledTimes(1);
    expect(showScreen.mock.calls.length).toBe(1);
    expect(showScreen.mock.calls[0][0]).toBe('dashboard.ChooseAccount');
  });

  it('If user not logged in should go to Login screen', async () => {
    await startApp();

    expect(mockGetAuth).toHaveBeenCalledTimes(1);
    expect(showScreen.mock.calls.length).toBe(1);
    expect(showScreen.mock.calls[0][0]).toBe('auth.Login');
  });
});