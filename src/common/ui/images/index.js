import icons from './app-icons';

/* eslint-disable global-require */
export default {
  getIconByUrl,
  addBusiness: require('./add-business.png'),
  communication: require('./communication.png'),
  noAvatar: require('./no-avatar.png'),
  noBusiness: require('./no-business.png'),
};

function getIconByUrl(url: string) {
  return icons.get(url);
}