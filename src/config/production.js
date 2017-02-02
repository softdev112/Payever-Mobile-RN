export default {
  siteUrl: 'https://mein.payever.de',
  // It's better to prevent using clientSecret. But after analyzing a lot
  // of resources I've made a decision that is's impossible.
  // FOSOAuthServerBundle doesn't support password auth without client_secret
  // https://github.com/FriendsOfSymfony/FOSOAuthServerBundle/issues/115
  api: {
    baseUrl: 'https://mein.payever.de',
    clientId: '1633_3vi6g4uiwmyow8044o4w0wo4s88cogosw84kw888kw408wok8c',
    clientSecret: '63nqx0kppzocw4sswok8gg800sk4w4kko4k0oo8gs4ow00wgos',
  },
  debug: {
    logApiCall: false,
  },
};