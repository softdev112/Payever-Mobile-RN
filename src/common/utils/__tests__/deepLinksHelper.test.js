/* eslint-disable max-len, global-require */
import { deepLinksHelper } from 'utils';
import Store from '../../../store';
import config from '../../../config';
import { showScreen } from '../../Navigation';
import navigator from '../../../../__mocks__/navigator';

jest.mock('../../Navigation');

const testProfiles = [
  {
    slug: 'slug',
  },
];

describe('Utils/deepLinksHelper', () => {
  let store;
  let profiles;

  beforeAll(() => {
    store = new Store(config);
    profiles = store.profiles;
    profiles.getAllProfiles = jest.fn(() => testProfiles);
    profiles.load = jest.fn();
    profiles.setCurrentProfile = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deepLinksHelper/processDeepLink(url, profiles, navigator)', () => {
    it('processDeepLink should NOT call navigation functions if url === null | undefined', () => {
      deepLinksHelper.processDeepLink(undefined, profiles, navigator);
      deepLinksHelper.processDeepLink(null, profiles, navigator);
      deepLinksHelper.processDeepLink('', profiles, navigator);

      expect(showScreen).not.toHaveBeenCalled();
      expect(navigator.showModal).not.toHaveBeenCalled();
      expect(profiles.getAllProfiles).not.toHaveBeenCalled();
    });

    it('processDeepLink should NOT call navigation functions if profiles === null and url do not contain /store/ and should not throw error', () => {
      expect(() => deepLinksHelper.processDeepLink('u', null, navigator))
        .not.toThrow();
      expect(() => deepLinksHelper.processDeepLink('u', undefined, navigator))
        .not.toThrow();

      expect(showScreen).not.toHaveBeenCalled();
      expect(navigator.showModal).not.toHaveBeenCalled();
      expect(profiles.getAllProfiles).not.toHaveBeenCalled();
    });

    it('processDeepLink should call navigator.showModal if profiles === null and url contain /store/ and should not throw error', () => {
      deepLinksHelper.processDeepLink(
        config.siteUrl + '/store/cool', null, navigator
      );
      deepLinksHelper.processDeepLink(
        config.siteUrl + '/store/cool', undefined, navigator
      );

      expect(navigator.showModal).toHaveBeenCalled();
      expect(navigator.showModal).toHaveBeenLastCalledWith({
        animated: true,
        screen: 'core.DeepLinksPopup',
      });
      expect(profiles.getAllProfiles).not.toHaveBeenCalled();
    });

    it('processDeepLink should NOT call navigation functions if navigator === null and should not throw error', () => {
      expect(() => deepLinksHelper.processDeepLink('u', profiles, null))
        .not.toThrow();
      expect(() => deepLinksHelper.processDeepLink('u', profiles, undefined))
        .not.toThrow();

      expect(showScreen).not.toHaveBeenCalled();
      expect(navigator.showModal).not.toHaveBeenCalled();
      expect(profiles.getAllProfiles).not.toHaveBeenCalled();
    });

    it('processDeepLink should call navigator.showModal => core.DeepLinksPopup if url contains site_domain/store/', () => {
      deepLinksHelper.processDeepLink(
        config.siteUrl + '/store/new', profiles, navigator
      );

      expect(navigator.showModal).toHaveBeenCalled();
      expect(navigator.showModal).toHaveBeenCalledWith({
        animated: true,
        screen: 'core.DeepLinksPopup',
      });
    });

    it('processDeepLink should NOT call navigation functions if url do not have slug information', () => {
      deepLinksHelper.processDeepLink(
        config.siteUrl + '/hello/new', profiles, navigator
      );

      expect(showScreen).not.toHaveBeenCalled();
      expect(navigator.showModal).not.toHaveBeenCalled();
      expect(profiles.getAllProfiles).not.toHaveBeenCalled();
    });

    it('processDeepLink should call navigator.showModal => core.ErrorPage if url contains /business/slug and profiles.load() return false', async () => {
      profiles.load.mockImplementationOnce(() => false);

      await deepLinksHelper.processDeepLink(
        config.siteUrl + '/business/slug/cool', profiles, navigator
      );

      expect(profiles.load).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith(
        'core.ErrorPage',
        { message: expect.any(String) }
      );
    });

    it('processDeepLink should call navigator.showModal => core.ErrorPage if url contains /private and profiles.load() return false', async () => {
      profiles.load.mockImplementationOnce(() => false);

      await deepLinksHelper.processDeepLink(
        config.siteUrl + '/private', profiles, navigator
      );

      expect(profiles.load).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith(
        'core.ErrorPage',
        { message: expect.any(String) }
      );
    });

    it('processDeepLink should call navigator.showModal => dashboard.Dashboard if url contains business/slug and profile was resolved successfully', async () => {
      profiles.load.mockImplementationOnce(() => true);

      await deepLinksHelper.processDeepLink(
        config.siteUrl + '/business/slug', profiles, navigator
      );

      expect(profiles.load).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith('dashboard.ChooseAccount');
    });

    it('processDeepLink should call navigator.showModal => dashboard.Private if url contains /private and profile was resolve successfully', async () => {
      profiles.load.mockImplementationOnce(() => true);

      await deepLinksHelper.processDeepLink(
        config.siteUrl + '/private', profiles, navigator
      );

      expect(profiles.load).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith('dashboard.Private');
    });

    it('processDeepLink should call navigator.showModal => dashboard.ChooseAccount if url contains business/slug but profile was NOT resolved successfully', async () => {
      profiles.load.mockImplementationOnce(() => true);
      profiles.getAllProfiles.mockImplementationOnce(() => []);

      await deepLinksHelper.processDeepLink(
        config.siteUrl + '/business/slug', profiles, navigator
      );

      expect(profiles.load).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith('dashboard.ChooseAccount');
    });

    it('processDeepLink should call navigator.showModal => dashboard.ChooseAccount if url contains /private but profile was NOT resolve successfully', async () => {
      profiles.load.mockImplementationOnce(() => true);
      profiles.getAllProfiles.mockImplementationOnce(() => []);

      await deepLinksHelper.processDeepLink(
        config.siteUrl + '/private', profiles, navigator
      );

      expect(profiles.load).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith('dashboard.ChooseAccount');
    });
  });
});