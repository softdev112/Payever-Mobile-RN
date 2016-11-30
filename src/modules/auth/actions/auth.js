export const SIGN_IN = 'auth.SIGN_IN';
export const SIGN_IN_FAILED = 'auth.SIGN_IN_FAILED';

export function signIn(username, password, navigator) {
  return async (dispatch, getState, { api }) => {
    try {
      const resp = await api.auth.login(username, password);
      if (!resp.ok) {
        return dispatch({
          type: SIGN_IN_FAILED,
          error: resp.data.error_description
        })
      }

      dispatch({
        type: SIGN_IN,
        data: {
          accessToken: resp.data.access_token,
          refreshToken: resp.data.refresh_token,
          expiresIn: resp.data.expires_in,
        }
      });

      navigator.resetTo({
        screen: 'dashboard.Dashboard',
        animated: true
      });
    } catch (e) {
      console.error(e);
      return dispatch({
        type: SIGN_IN_FAILED,
        error: 'Unknown error'
      })
    }
  };
}