import local from './local';

export default Object.assign({
  siteUrl: 'https://mein.payever.de',
  api: {
    baseUrl: 'https://mein.payever.de',
    clientId: '1633_3vi6g4uiwmyow8044o4w0wo4s88cogosw84kw888kw408wok8c',
    clientSecret: '63nqx0kppzocw4sswok8gg800sk4w4kko4k0oo8gs4ow00wgos',
  },
  debug: {
    logApiCall: true,
  },
}, local);