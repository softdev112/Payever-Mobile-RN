import { Component } from 'react';
import { Image, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

const images = {
  transactions: require('../images/transactions.png'),
  products: require('../images/items_app.png'),
  home: require('../images/home.png'),
  communication: require('../images/communication.png'),
  stores: require('../images/my_stores.png')
};

@connect(state => ({
  slug: state.user.get('currentProfile').slug,
  siteUrl: state.config.get('siteUrl')
}))
export default class AppIcon extends Component {
  onPress() {
    const { name, slug, siteUrl, navigator, title } = this.props;
    const url = `${siteUrl}/business/${slug}/${name}`;
    if (url) {
      navigator.push({
        title,
        screen: 'core.WebView',
        passProps: { url },
      })
    }
  }

  render() {
    const { icon } = this.props;
    return (
      <TouchableHighlight onPress={::this.onPress}>
        <Image
          source={images[icon]}
          style={{ width: 60, height: 60 }}
        />
      </TouchableHighlight>
    );
  }
}