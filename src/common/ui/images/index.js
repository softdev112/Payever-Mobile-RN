import icons from './app-icons';
import config from '../../../config';

/* eslint-disable global-require */
export default {
  getIconByUrl,
  addBusiness: require('./add-business.png'),
  communication: require('./communication.png'),
  noAvatar: require('./no-avatar.png'),
  noBusiness: require('./no-business.png'),
};

function getIconByUrl(url: string) {
  if (!url) return url;

  const cacheUrl = url.replace(config.siteUrl, '').split('?')[0];
  return icons.get(cacheUrl);
}