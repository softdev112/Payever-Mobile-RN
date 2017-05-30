import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Image, ScrollView } from 'react-native';
import { Loader, NavBar, StyleSheet, View } from 'ui';
import type Media from '../../../store/communication/models/Media';
import * as Config from '../../../config';

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;
const SCALE_STEP = 0.1;

@inject('config')
@observer
export default class ImageMedia extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    media: Media;
    config: Config;
  };

  state: {
    scale: number;
    imgLoaded: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      imageScale: 0.5,
      imageLoaded: false,
    };
  }

  onZoomIn() {
    const { imageScale } = this.state;

    let newScale = imageScale + SCALE_STEP;
    if (newScale > MAX_SCALE) {
      newScale = MAX_SCALE;
    }

    this.setState({ imageScale: newScale });
  }

  onZoomOut() {
    const { imageScale } = this.state;

    let newScale = imageScale - SCALE_STEP;
    if (newScale < MIN_SCALE) {
      newScale = MIN_SCALE;
    }

    this.setState({ imageScale: newScale });
  }

  onImageLoaded() {
    this.setState({ imgLoaded: true });
  }

  render() {
    const { config, media } = this.props;
    const { imageScale, imgLoaded } = this.state;
    const { width, height } = media.formats.reference.properties;

    const title = `${media.name.substr(0, 20)}...`;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title showTitle="always" title={title} />

          <NavBar.IconButton
            imageStyle={styles.zoomIcons}
            source="icon-storebuilder-zoom-in-32"
            onPress={::this.onZoomIn}
          />
          <NavBar.IconButton
            imageStyle={styles.zoomIcons}
            source="icon-storebuilder-zoom-out-32"
            onPress={::this.onZoomOut}
          />
        </NavBar>
        <Loader style={styles.loader} isLoading={!imgLoaded} />

        <ScrollView>
          <ScrollView horizontal>
            <Image
              style={{
                width: width * imageScale,
                height: height * imageScale,
              }}
              onLoadEnd={::this.onImageLoaded}
              source={{ uri: config.siteUrl + media.url }}
            />
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  zoomIcons: {
    color: '#000',
    fontSize: 22,
  },

  loader: {
    marginTop: '28%',
  },

  insideScrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});