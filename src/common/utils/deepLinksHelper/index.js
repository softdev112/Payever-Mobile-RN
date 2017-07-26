import { Navigator } from 'react-native-navigation';
import config from '../../../config';
import { showScreen } from '../../Navigation';

export default {
  processDeepLink,
};

async function processDeepLink(
  url: string,
  profiles,
  navigator: Navigator = null
) {
  if (!url || !navigator) return;

  if (url.startsWith(config.siteUrl + '/store/')) {
    navigator.showModal({
      screen: 'core.DeepLinksPopup',
      animated: true,
    });
    return;
  }

  if (!profiles) return;

  let slug = '';
  if (url.startsWith(config.siteUrl + '/business/')) {
    // Business profile
    const urlParts = url.split(config.siteUrl + '/business/');
    slug = urlParts[1].split('/')[0];
  } else if (url.startsWith(config.siteUrl + '/private')) {
    // Private profile
    slug = 'private';
  }

  if (slug === '') {
    return;
  }

  if (!await profiles.load()) {
    showScreen('core.ErrorPage', { message: profiles.error });
    return;
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
    linkProfile.isBusiness ? 'dashboard.Dashboard' : 'dashboard.Private'
  );
}