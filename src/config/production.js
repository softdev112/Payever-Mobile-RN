export default {
  siteUrl: 'https://showroom9.payever.de',
  // It's better to prevent using clientSecret. But after analyzing a lot
  // of resources I've made a decision that is's impossible.
  // FOSOAuthServerBundle doesn't support password auth without client_secret
  // https://github.com/FriendsOfSymfony/FOSOAuthServerBundle/issues/115
  api: {
    baseUrl: 'https://showroom9.payever.de',
    clientId: '117_5sd54ii2lyo8sg84g0w4w08wkw4040gks4k0sk0wgc44w48404',
    clientSecret: '4jsu5lynawsg8g4cs80w4kcsocwcggwo048ogs8c844gk80w80',
  },
  debug: {
    logApiCall: false,
  },
};