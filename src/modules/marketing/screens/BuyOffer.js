import { Component } from 'react';
import { NavBar, View, WebView } from 'ui';

export default class BuyOffer extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    itemId: number;
    marketingSlug: string;
  };

  render() {
    const { itemId, marketingSlug } = this.props;
    const uri = `/store/${marketingSlug}#product/${itemId}`;

    return (
      <View style={{ flex: 1 }}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Buy Offer" />
        </NavBar>
        <WebView showNavBar="never" source={{ uri }} />
      </View>
    );
  }
}