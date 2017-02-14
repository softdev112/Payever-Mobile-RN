export default {
  currency(num, currency = '€') {
    /* eslint-disable */
    // Todo: reformat
    num = parseInt(num) || 0;
    const [integer, fractional] = num.toFixed(2).split('.');
    return integer.split('').reverse().reduce(
      (acc, num, i, orig) => {
        return  num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
      },
      ''
    ) + '.' + fractional + currency;
  }
}