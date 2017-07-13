import { Component, PropTypes } from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-navigation';
import FileOpener from 'react-native-file-opener';
import RNFetchBlob from 'react-native-fetch-blob';
import { Icon, StyleSheet, Text, View } from 'ui';
import { format, log, screenParams, androidMimeTypes } from 'utils';
import Media from '../../../../store/communication/models/Media';
import config from '../../../../config';

export default class MediaView extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    media: Media;
  };

  context: {
    navigator: Navigator;
  };

  async onMediaPress() {
    const { media } = this.props;


    if (media.isImage) {
      this.context.navigator.push({
        screen: 'communication.ImageMedia',
        passProps: { media },
        animated: true,
      });
    } else {
      try {
        const saveDir = Platform.OS === 'ios'
          ? RNFetchBlob.fs.dirs.CacheDir : RNFetchBlob.fs.dirs.DownloadDir;

        const fileResp = await RNFetchBlob.config({
          fileCache: true,
          path:  `${saveDir}/${media.name}`,
        }).fetch('GET', config.siteUrl + media.formats.reference.url);

        if (fileResp && fileResp.respInfo.status === 200) {
          const filePath = await fileResp.path();

          const filePathParts = filePath.split('.');
          const fileExt = filePathParts[filePathParts.length - 1];

          await FileOpener.open(
            filePath,
            Platform.OS === 'ios' ? '' : androidMimeTypes.getTypeByExt(fileExt)
          );
        }
      } catch (err) {
        log.error(err);
      }
    }
  }

  renderMediaFile() {
    const { media } = this.props;

    return (
      <View style={styles.file}>
        <Icon style={styles.file_icon} source="icon-download-32" />
        <Text
          style={styles.file_name}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {media.name}
        </Text>
        <Text style={styles.file_size}>{format.size(media.size)}</Text>
      </View>
    );
  }

  renderMediaImage() {
    const { media } = this.props;

    let properties;
    try {
      properties = media.formats.reference.properties;
    } catch (e) {
      properties = {};
    }

    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode="middle">{media.name}</Text>
        <Image
          style={calcImageDimensions(properties)}
          source={{ uri: config.siteUrl + media.url }}
        />
      </View>
    );
  }

  render() {
    const { media } = this.props;

    return (
      <View>
        <Text style={styles.label}>Sent a file</Text>
        <TouchableOpacity onPress={::this.onMediaPress}>
          { media.isImage ? this.renderMediaImage() : this.renderMediaFile()}
        </TouchableOpacity>
      </View>
    );
  }
}

export function calcImageDimensions(imageProperties) {
  const OFFSET = 130;
  const MAX = 300;

  const { width: wndWidth, height: wndHeight } = screenParams;
  const {
    width: srcWidth = MAX,
    height: srcHeight = MAX,
  } = imageProperties || {};

  const maxSize = Math.min(
    wndWidth - OFFSET,
    wndHeight - OFFSET,
    MAX
  );

  if (Math.max(srcWidth, srcHeight, maxSize) <= maxSize) {
    return { width: srcWidth, height: srcHeight };
  }

  const newWidth = Math.min(srcWidth, maxSize);
  const newHeight = Math.min(srcHeight, maxSize);

  if (srcWidth / newWidth > srcHeight / newHeight) {
    return { width: newWidth, height: srcHeight * (newWidth / srcWidth) };
  }

  return { width: srcWidth * (newHeight / srcHeight), height: newHeight };
}

const styles = StyleSheet.create({
  label: {
    color: '$pe_color_gray_2',
    fontSize: 13,
    paddingBottom: 7,
  },

  file: {
    alignItems: 'center',
    borderColor: 'rgba(61, 61, 61, 0.2)',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
  },

  file_icon: {
    color: '$pe_color_blue',
  },

  file_name: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 14,
  },

  file_size: {
    color: '#848485',
    fontSize: 14,
  },
});