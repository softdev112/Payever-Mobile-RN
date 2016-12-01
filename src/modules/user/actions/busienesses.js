import { concat } from 'lodash';

import type PayeverApi from '../../../common/PayeverApi';
import { showLoader, hideLoader } from '../../core/actions/loader';

export const GET_BUSINESSES = 'user.GET_BUSINESSES';

export function getBusinesses() {
  return async (dispatch, getState, { api }) => {
    dispatch(showLoader());
    try {
      const resp = await api.user.getBusinesses();
      if (!resp.ok) {
        return dispatch({
          type: 'false',
          error: resp.data.error_description
        })
      }

      dispatch({
        type: GET_BUSINESSES,
        data: normalizeBusiness(resp.data)
      });
    } catch (e) {
      dispatch({
        e,
        type: 'false',
        error: 'Unknown error',
      })
    }

    dispatch(hideLoader());
  };
}

function normalizeBusiness(data) {
  const businesses = data.businesses;
  if (!businesses || !businesses.own || !businesses.staff) {
    return [];
  }

  return concat(
    businesses.own.map(b => { b.own = true; return b }),
    businesses.staff
  );
}