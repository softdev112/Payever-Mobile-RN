import type { DashboardAppItem } from 'api/BusinessApi';

import { Component } from 'react';
import { connect } from 'react-redux';
import { GridView, ImageButton, Loader, View } from 'ui';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as userActions from '../../user/actions/user';

function mapStateToProps(state) {
  const profileId = state.user.get('currentProfile').id;
  const menu = state.user.get('menu').get(profileId) || [];

  menu.sort((a, b) => a.position - b.position);

  return {
    profileId,
    menuTop: menu.filter(i => i.location === 'top'),
    menuBottom: menu.filter(i => i.location === 'bottom')
  }
}

@connect(mapStateToProps)
export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  componentWillMount() {
    const { dispatch, profileId } = this.props;
    if (profileId) {
      dispatch(userActions.loadMenu(profileId));
    }
  }

  onAppClick(item: MenuItem) {
    const { navigator, } = this.props;
    console.log(item);
    if (item.url) {
      navigator.push({
        title: item.name,
        screen: 'core.WebView',
        passProps: { url: item.url },
      })
    }
  }

  renderTopRow(item: DashboardAppItem) {
    return (
      <ImageButton
        imageStyle={styles.logoTop}
        style={styles.itemTop}
        onPress={() => this.onAppClick(item)}
        source={{ uri: item.image}}
        title={item.name}
      />
    );
  }

  renderBottomRow(item: DashboardAppItem) {
    return (
      <ImageButton
        imageStyle={styles.logoBottom}
        textStyle={styles.textBottom}
        style={styles.itemBottom}
        onPress={() => this.onAppClick(item)}
        source={{ uri: item.image}}
        title={item.name}
      />
    );
  }

  render() {
    const { menuTop, menuBottom } = this.props;
    const ds = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const dataSourceTop = ds.cloneWithRows(menuTop);
    const dataSourceBottom = ds.cloneWithRows(menuBottom);

    return (
      <Loader containerStyle={styles.loaderContainer}>
        <GridView
          dataSource={dataSourceTop}
          renderRow={::this.renderTopRow}
          contentContainerStyle={styles.gridTop}
        />
        <View>
          <GridView
            dataSource={dataSourceBottom}
            renderRow={::this.renderBottomRow}
            contentContainerStyle={styles.gridBottom}
          />
        </View>

      </Loader>
    );
  }
}

const styles = EStyleSheet.create({
  loaderContainer: {
    flex: 1
  },
  gridTop: {
    flex: 2,
    paddingTop: 20,
  },
  itemTop: {
    width: 120,
    height: 90,
  },
  logoTop: {
    width: 50,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#dadada',
    shadowColor: "#000000",
    shadowOpacity: 1,
    shadowRadius: 5
  },
  gridBottom: {
    flexWrap: 'nowrap',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: '#fafafa'
  },
  itemBottom: {
    width: 70,
    height: 80
  },
  logoBottom: {
    width: 40,
    height: 40
  },
  textBottom: {
    fontSize: 12
  }
});