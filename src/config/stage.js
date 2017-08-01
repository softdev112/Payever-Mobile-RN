/* eslint-disable max-len */
export default {
  siteUrl: 'https://stage.payever.de',
  api: {
    baseUrl: 'https://stage.payever.de',
    clientId: '117_5sd54ii2lyo8sg84g0w4w08wkw4040gks4k0sk0wgc44w48404',
    clientSecret: '4jsu5lynawsg8g4cs80w4kcsocwcggwo048ogs8c844gk80w80',
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
      callback: 'https://stage.payever.de/social/mobile/connect',
      scope: 'r_basicprofile r_emailaddress',
    },
  },
};