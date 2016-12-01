import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Text, View } from 'react-native';

import { concat } from 'lodash';

import * as businessActions from '../../user/actions/busienesses'
import * as userActions from '../../user/actions/user';
import Loader from '../../core/components/Loader';

@connect((state) => ({
  businesses: state.businesses.toArray()
}))
export default class Businesses extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(businessActions.getBusinesses());
  }

  onBusinessClick(business) {
    const { dispatch, navigator } = this.props;
    dispatch(userActions.setCurrentBusiness(business));
    navigator.resetTo({
      screen: 'dashboard.Dashboard',
      animated: true
    });
  }

  renderBusiness(business) {
    return (
      <Button
        key={business.slug}
        onPress={() => this.onBusinessClick(business)}
        title={business.name}
      />
    )
  }

  render() {
    const { businesses } = this.props;
    return (
      <View>
        <Loader />
        {businesses.map(::this.renderBusiness)}
      </View>
    );
  }
}