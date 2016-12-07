import { showLoader, hideLoader } from '../../core/actions/loader';

export const SET_PROFILES = 'user.SET_PROFILES';
export const SET_CURRENT_PROFILE = 'user.SET_CURRENT_BUSINESS';
export const SET_MENU = 'user.SET_MENU';

export function setCurrentProfile(business) {
  return {
    type: SET_CURRENT_PROFILE,
    data: business
  }
}

// TODO Think about ERROR
export function loadProfiles() {
  return async (dispatch, getState, { api }) => {
    dispatch(showLoader());
    try {
      const resp = await api.profiles.getAccessibleList();
      if (!resp.ok) {
        return dispatch({ type: 'ERROR', error: resp.data.error_description })
      }

      dispatch({ type: SET_PROFILES,  data: resp.data });
    } catch (e) {
      dispatch({
        e,
        type: 'ERROR',
        error: 'Unknown error',
      })
    }

    dispatch(hideLoader());
  };
}

// TODO Think about ERROR
export function loadMenu(profileId) {
  return async (dispatch, getState, { api }) => {
    dispatch(showLoader());
    try {
      const resp = await api.menu.getList(profileId);
      if (!resp.ok) {
        return dispatch({ type: 'ERROR', error: resp.data.error_description })
      }

      dispatch({
        profileId,
        type: SET_MENU,
        data: resp.data
      });
    } catch (e) {
      dispatch({
        e,
        type: 'ERROR',
        error: 'Unknown error',
      })
    }

    dispatch(hideLoader());
  };
}