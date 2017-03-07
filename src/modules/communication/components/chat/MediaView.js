/* eslint-disable react/prefer-stateless-function */
import { Component } from 'react';
import { Image, Dimensions, Linking, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Icon, StyleSheet, Text, View } from 'ui';
import { format } from 'utils';
import Media from '../../../../store/communication/models/Media';
import { Config } from '../../../../config';

@inject('config')
@observer
export default class MediaView extends Component {
  props: {
    config?: Config;
    media: Media;
  };

  render() {
    const { config, media } = this.props;
    const AttachmentComponent = media.isImage ? MediaImage : MediaFile;
    const url = config.siteUrl + media.url;

    return (
      <View>
        <Text style={styles.label}>Sent a file</Text>
        <TouchableOpacity onPress={() => Linking.openURL(url)}>
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

function MediaImage({ media }: PropTypes) {
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
        style={[styles.image, calcImageDimensions(properties)]}
        source={{ uri: media.url }}
      />
    </View>
  );
}

export function calcImageDimensions(imageProperties) {
  const OFFSET = 130;
  const MAX = 300;

  const { width: wndWidth, height: wndHeight } = Dimensions.get('window');
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

type PropTypes = {
  media: Media;
};