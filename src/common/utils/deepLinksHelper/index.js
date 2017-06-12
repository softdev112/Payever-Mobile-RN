import { Navigation } from 'react-native-navigation';
import { Config } from '../../../config';
import { showScreen } from '../../Navigation';

export default {
  processStoresDeepLinks,
  processDeepLink,
};

function processStoresDeepLinks(url) {
  if (!url) return false;

  if (url.startsWith(Config.siteUrl + '/store/')) {
    Navigation.showModal({
      screen: 'core.DeepLinksPopup',
      passProps: { url },
      animated: true,
    });
    return true;
  }

  return false;
}

async function processDeepLink(url, store) {
  if (!url) return;

  const { config, profiles } = store;
  let slug = '';
  if (url.startsWith(config.siteUrl + '/business/')) {
    // Business profile
    const urlParts = url.split(config.siteUrl + '/business/');
    slug = urlParts[1].substr(0, urlParts[1].indexOf('/'));
  } else if (url.startsWith(config.siteUrl + '/private')) {
    // Private profile
    slug = 'private';
  }

  if (slug === '') {
    showScreen('core.WebView', { url });
    return;
  }

  if (!await profiles.load()) {
    showScreen('core.ErrorPage', { message: profiles.error });
  }

  let linkProfile = null;
  const allProfiles = profiles.getAllProfiles();
  if (slug === 'private') {
    linkProfile = allProfiles[0];
  } else {
    linkProfile = allProfiles.find(
      p => p.business && (p.business.slug === slug)
    );
  }

  if (!linkProfile) {
    showScreen('dashboard.ChooseAccount');
    return;
  }

  profiles.setCurrentProfile(linkProfile);
  showScreen(
    linkProfile.isBusiness ? 'dashboard.Dashboard' : 'dashboard.Private',
    { deepLink: url }
  );
}