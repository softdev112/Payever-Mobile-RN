import { formatSource, isExternalUrl, redirectOnUrl } from '../index';

describe('ui/WebView', () => {
  describe('formatSource', () => {
    it('should return html code on a simple url', () => {
      const source = formatSource({ uri: 'http://example.com' });
      expect(source.html).toEqual(expect.any(String));
    });

    it('should return an uri with headers when a referer is specified', () => {
      const source = formatSource({ uri: 'http://ya.ru', referer: 'ya.ru' });
      expect(source).toEqual({
        uri: 'http://ya.ru',
        headers: { Referer: 'ya.ru' },
      });
    });

    it('should add base url', () => {
      const source = formatSource(
        { uri: '/relative/url', referer: 'ya.ru' },
        'https://ya.ru'
      );
      expect(source).toEqual({
        uri: 'https://ya.ru/relative/url',
        headers: { Referer: 'ya.ru' },
      });
    });
  });

  describe('isExternalUrl', () => {
    it('should return false for external sites', () => {
      const site = 'https://mein.payever.de';
      expect(isExternalUrl('http://ya.ru', site)).toBeTruthy();
      expect(isExternalUrl('https://stage.payever.de', site)).toBeTruthy();
    });

    it('should return false for internal or system links', () => {
      const site = 'https://mein.payever.de';
      expect(isExternalUrl(`${site}/private`, site)).toBeFalsy();
      expect(isExternalUrl('about:blank', site)).toBeFalsy();
      expect(isExternalUrl('data:text=Test', site)).toBeFalsy();
    });
  });

  describe('redirectOnUrl', () => {
    it('should test simple matches', () => {
      expect(match('/selfterminal')).toEqual({ back: true });
      expect(match(/shop-\d+\/pos/)).toEqual({ back: true });
      expect(match(['/selfterminal', /shop-\d+\/pos/])).toEqual({ back: true });
      expect(match('/selfterminal2')).toEqual(false);
      expect(match(null)).toEqual(false);
      expect(match(undefined)).toEqual(false);
    });

    it('should test object matches', () => {
      expect(match(
        { match: 'selfterminal', screen: 'Screen1' }
      )).toEqual({ screen: 'Screen1' });

      expect(match([
        { match: 'false', screen: 'Screen1' },
        { match: 'selfterminal', screen: 'Screen2' },
      ])).toEqual({ screen: 'Screen2' });

      expect(match([
        { match: 'false', screen: 'Screen1' },
        { match: 'false2', screen: 'Screen2' },
      ])).toEqual(false);
    });

    function match(matches) {
      matches = [].concat(matches);
      const url = 'https://mein.payever.de/selfterminal/new/shop-1/pos/xxxlutz';
      return redirectOnUrl(url, matches);
    }
  });
});