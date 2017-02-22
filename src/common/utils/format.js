import moment from 'moment';

export default {
  currency(num, currency = '€') {
    num = parseFloat(num) || 0;
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + currency;
  },

  timeFromNow(date) {
    return moment(date).fromNow();
  },
};