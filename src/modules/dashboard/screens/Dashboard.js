import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type AppItem from '../../../store/UserProfilesStore/AppItem';

import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { GridView, ImageButton, Loader, StyleSheet, View } from 'ui';

import SearchHeader from '../components/SearchHeader';

@inject('userProfiles')
@observer
export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  dataSource: GridView.DataSource;

  props: {
    navigator: Navigator,
    userProfiles: UserProfilesStore
  };

  state: {
    appsTop: Array<AppItem>,
    appsBottom: Array<AppItem>
  };

  constructor() {
    super();

    this.state = {
      appsTop: [],
      appsBottom: []
    };

    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
  }

  async componentWillMount() {
    const { userProfiles } = this.props;
    const apps = await userProfiles.currentProfile.getApplications();
    this.setState({
      appsTop: apps.filter(a => a.location === 'top'),
      appsBottom: apps.filter(a => a.location === 'bottom')
    });
  }

  onAppClick(item: AppItem) {
    const { navigator, } = this.props;
    if (item.url) {
      navigator.push({
        title: item.name,
        screen: 'core.WebView',
        passProps: { url: item.url },
      })
    }
  }

  renderTopRow(item: AppItem) {
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

  renderBottomRow(item: AppItem) {
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
    const { appsTop, appsBottom } = this.state;
    const dataSourceTop = this.dataSource.cloneWithRows(appsTop);
    const dataSourceBottom = this.dataSource.cloneWithRows(appsBottom);

    return (
      <Loader
        isLoading={!appsTop.length}
        containerStyle={styles.loaderContainer}
      >
        <SearchHeader navigator={this.props.navigator} />
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

const styles = StyleSheet.create({
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