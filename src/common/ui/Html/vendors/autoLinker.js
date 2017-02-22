import autoLinker from 'autolinker';
import * as log from '../../../utils/log';

export default autoLinker;

// Patch AutoLinker phone number regexp
try {
  /* eslint-disable indent */
  const phoneRegExp = [
    '(1[ +-]{0,3}|\\+1[ +-]{0,3}|\\+1|\\+)?',
    '(',
    '(\\(\\+?1-[2-9][0-9]{1,2}\\))|',
    '(\\(\\+?[2-8][0-9][0-9]\\))|',
    '(\\(\\+?[1-9][0-9]\\))|',
    '(\\(\\+?[17]\\))|',
    '(\\([2-9][2-9]\\))|',
    '([ .-]{0,3}[0-9]{2,4})',
    ')?',
    '([ .-][0-9])?',
    '([ .-]{0,3}[0-9]{2,4}){2,3}',
  ].join('');
  //noinspection JSUnresolvedVariable
  const phoneMatcher = autoLinker.matcher.Phone.prototype;
  //noinspection JSAccessibilityCheck
  phoneMatcher.matcherRegex = new RegExp(phoneRegExp, 'g');
} catch (e) {
  log.warn('Couldn\'t patch AutoLinker');
}