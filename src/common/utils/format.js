import moment from 'moment';

export default {
  currency(num, currency = '€'): string {
    num = parseFloat(num) || 0;
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + currency;
  },

  timeFromNow(date): string {
    return moment(date).fromNow();
  },

  /**
   * Return human readable size with metric prefix
   */
  size(bytes: number): string {
    if (bytes === 0) return '0 B';
    const e = Math.floor(Math.log(bytes) / Math.log(1000));
    return +(bytes / (1000 ** e)).toFixed(1) + ' ' +
      'BKMGTP'.charAt(e).replace('B', '') + 'B';
  },

  /**
   * Return string without any html tags
   *
   */
  stripHtml(text: string): string {
    return text.replace(/<[^>]*>/g, '');
  },
};