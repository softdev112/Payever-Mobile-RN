export const SET_CURRENT_BUSINESS = 'user.SET_CURRENT_BUSINESS';

export function setCurrentBusiness(business) {
  return {
    type: SET_CURRENT_BUSINESS,
    data: business
  }
}