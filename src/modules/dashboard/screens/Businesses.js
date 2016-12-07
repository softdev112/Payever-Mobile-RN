import { Component } from 'react';
import { connect } from 'react-redux';
import { concat } from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import { GridView, Header, ImageButton, View } from 'ui';

import * as userActions from '../../user/actions/user';
import Loader from '../../../common/ui/Loader';

import imgNoBusiness from '../images/no-business.png';

@connect((state) => ({
  profiles: state.user.get('profiles')
}))
export default class Businesses extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(userActions.loadProfiles());
  }

  onBusinessClick(business) {
    const { dispatch, navigator } = this.props;
    dispatch(userActions.setCurrentProfile(business));
    navigator.resetTo({
      screen: 'dashboard.Dashboard',
      title: 'Home',
      animated: true
    });
  }

  renderRow(profile) {
    if (profile.user) {
      const { user } = profile;
      return (
        <ImageButton
          imageStyle={styles.logo}
          style={styles.item}
          onPress={() => this.onBusinessClick(profile)}
          source={{ uri: user.avatar }}
          title={user.full_name}
        />
      )
    } else {
      const { business } = profile;
      const logo = business.logo ? { uri: business.logo } : imgNoBusiness;
      return (
        <ImageButton
          imageStyle={styles.logo}
          style={styles.item}
          onPress={() => this.onBusinessClick(profile)}
          source={logo}
          title={business.name}
        />
      );
    }
  }

  render() {
    const { profiles } = this.props;

    const ds = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const dataSource = ds.cloneWithRows(concat(
      profiles.private,
      profiles.businesses_own,
      profiles.businesses_staff
    ));

    return (
      <View>
        <Header>Welcome back. Please choose buying or selling account.</Header>
        <Loader>
          <GridView
            dataSource={dataSource}
            renderRow={::this.renderRow}
            contentContainerStyle={styles.grid}
          />
        </Loader>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  grid: {
    paddingTop: 20
  },
  item: {
    width: 120,
    height: 120,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});