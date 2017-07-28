/* eslint-disable max-len */
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
  reqTimeout: 10000,

  oauthData: {
    twitter: {
      appId: 'oRCkHDAnAFSXiO1wayGlpBkwn',
      appSecret: 'C3FUgIBnjdn1Je6dD5NX5AboFEJ1vWqVVwOLJ03Itk0Xp58but',
      callback: '/social/auth/twitter',
    },

    facebook: {
      appId: '302838276848223',
      appSecret: '188dcf1590b667929d5f8b4538b00075',
      callback: 'fb302838276848223://authorize',
      scope: 'email public_profile',
      fields: [
        'id', 'name', 'first_name', 'last_name',
        'picture.type(large)', 'email', 'cover', 'birthday',
      ],
    },

    google: {
      appId: '463919467171-u54vacd9oiso7l14f97g38odsak91njg.apps.googleusercontent.com',
      appSecret: 'SihRvMNWT2j5088wEZ_A2MRR',
      callback: 'com.googleusercontent.apps.463919467171-u54vacd9oiso7l14f97g38odsak91njg:/google',
      scope: 'https://www.googleapis.com/auth/content',
    },

    linkedIn: {
      appId: '78a1v96xm7x1tt',
      appSecret: 'Umu6R25x1w7NiDt6',
      callback: 'https://localhost:3003/auth/linkedin',
      scope: 'r_basicprofile r_emailaddress',
    },
  },
};