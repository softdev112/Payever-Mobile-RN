/* eslint-disable global-require, max-len */

export default {
  'auth.Login': require('./modules/auth/screens/Login').default,
  'communication.Chat': require('./modules/communication/screens/Chat').default,
  'communication.Main': require('./modules/communication/screens/Main').default,
  'communication.Settings': require('./modules/communication/screens/Settings').default,
  'core.Debug': require('./modules/core/screens/Debug').default,
  'core.ErrorPage': require('./modules/core/screens/ErrorPage').default,
  'core.SideMenu': require('./modules/core/screens/SideMenu').default,
  'core.WebView': require('./modules/core/screens/WebView').default,
  'dashboard.ChooseAccount': require('./modules/dashboard/screens/ChooseAccount').default,
  'dashboard.Dashboard': require('./modules/dashboard/screens/Dashboard').default,
  'dashboard.Private': require('./modules/dashboard/screens/Private').default,
  'dashboard.Search': require('./modules/dashboard/screens/Search').default,
  'marketing.BuyOffer': require('./modules/marketing/screens/BuyOffer').default,
  'marketing.ViewOffer': require('./modules/marketing/screens/ViewOffer').default,
};