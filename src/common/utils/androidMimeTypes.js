const mimeTypes = {
  mp3:     'audio/mpeg',
  mpga:    'audio/mpeg',
  m4a:     'audio/mp4',
  wav:     'audio/x-wav',
  amr:     'audio/amr',
  awb:     'audio/amr-wb',
  wma:     'audio/x-ms-wma',
  ogg:     'audio/ogg, application/ogg',
  aac:     'audio/aac, audio/aac-adts',
  mka:     'audio/x-matroska',
  mid:     'audio/midi',
  midi:    'audio/midi',
  xmf:     'audio/midi',
  rtttl:   'audio/midi',
  smf:     'audio/sp-midi',
  imy:     'audio/imelody',
  rtx:     'audio/midi',
  ota:     'audio/midi',
  mxmf:    'audio/midi',
  mpeg:    'video/mpeg, video/mp2p',
  mpg:     'video/mpeg, video/mp2p',
  mp4:     'video/mp4',
  m4v:     'video/mp4',
  '3gp':   'video/3gpp',
  '3gpp':  'video/3gpp',
  '3G2':   'video/3gpp2',
  '3GPP2': 'video/3gpp2',
  mkv:     'video/x-matroska',
  webm:    'video/webm',
  ts:      'video/mp2ts',
  avi:     'video/avi',
  wmv:     'video/x-ms-wmv',
  asf:     'video/x-ms-asf',
  jpg:     'image/jpeg',
  jpeg:    'image/jpeg',
  gif:     'image/gif',
  png:     'image/png',
  bmp:     'image/x-ms-bmp',
  wbmp:    'image/vnd.wap.wbmp',
  webp:    'image/webp',
  m3u:     'audio/x-mpegurl, application/x-mpegurl',
  pls:     'audio/x-scpls',
  wpl:     'application/vnd.ms-wpl',
  m3u8:    'application/vnd.apple.mpegurl, audio/mpegurl, audio/x-mpegurl',
  fl:      'application/x-android-drm-fl',
  txt:     'text/plain',
  htm:     'text/html',
  html:    'text/html',
  pdf:     'application/pdf',
  doc:     'application/msword',
  xls:     'application/vnd.ms-excel',
  ppt:     'application/mspowerpoint',
  flac:    'audio/flac',
  zip:     'application/zip',
  rar:     'application/zip',
};

function getTypeByExt(ext: string) {
  if (!ext || ext === '') return '*/*';

  let fileExt = ext;
  if (ext.startsWith('.')) {
    fileExt = ext.substr(1).toLowerCase();
  }

  return mimeTypes[fileExt] ? mimeTypes[fileExt] : '*/*';
}

export default {
  getTypeByExt,
};