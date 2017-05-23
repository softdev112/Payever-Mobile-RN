/* eslint-disable react/prefer-stateless-function */
import { Component, PropTypes } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { Navigator } from 'react-native-navigation';
import { Icon, StyleSheet, Text, View } from 'ui';
import { format, ScreenParams } from 'utils';
import Media from '../../../../store/communication/models/Media';
import { Config } from '../../../../config';

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

  onMediaPress() {
    const { media } = this.props;

    this.context.navigator.push({
      screen: 'communication.ImageMedia',
      passProps: { media },
      animated: true,
    });
  }

  render() {
    const { media } = this.props;
    const AttachmentComponent = media.isImage ? MediaImage : MediaFile;

    return (
      <View>
        <Text style={styles.label}>Sent a file</Text>
        <TouchableOpacity onPress={::this.onMediaPress}>
          <AttachmentComponent media={media} />
        </TouchableOpacity>
      </View>
    );
  }
}

function MediaFile({ media }: PropTypes) {
  return (
    <View style={styles.file}>
      <Icon style={styles.file_icon} source="icon-download-32" />
      <Text style={styles.file_name} numberOfLines={1} ellipsizeMode="middle">
        {media.name}
      </Text>
      <Text style={styles.file_size}>{format.size(media.size)}</Text>
    </View>
  );
}

const MediaImage = observer(['config'], ({ media, config }: MediaImageObj) => {
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
});

export function calcImageDimensions(imageProperties) {
  const OFFSET = 130;
  const MAX = 300;

  const { width: wndWidth, height: wndHeight } = ScreenParams;
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

type MediaImageObj = {
  media: Media;
  config?: Config;
};