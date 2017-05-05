import { Component, PropTypes } from 'react';
import { images, NavBar, StyleSheet, View } from 'ui';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import Contacts from '../components/contacts';
import Dock from '../../../modules/dashboard/components/Dock';
import Profiles from '../../../store/profiles';
import AppItem from '../../../store/profiles/models/AppItem';

@inject('profiles')
@observer
export default class ContactsScreen extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    profiles: Profiles;
    navigator: Navigator;
  };

  context: {
    navigator: Navigator;
  };

  constructor(props) {
    super(props);

    this.state = {
      appsBottom: [],
    };
  }

  async componentWillMount() {
    const { profiles } = this.props;
    const profile = profiles.currentProfile;

    const apps = await profiles.loadApplications(profile.id);
    this.setState({
      appsBottom: apps.filter(a => a.location === 'bottom'),
    });
  }

  onAppClick(app: AppItem) {
    const { navigator } = this.context;

    if (app.label.toLowerCase() === 'communication') return;

    if (app.label === 'dashboard' || app.label === 'home') {
      navigator.pop({ animated: true });
      return;
    }

    if (app.settings.screenId) {
      navigator.push({
        title: app.name,
        screen: app.settings.screenId,
      });
      return;
    }

    if (app.url) {
      navigator.push({
        title: app.name,
        screen: 'core.WebView',
        passProps: {
          ...app.settings.webView,
          url: app.url,
        },
      });
    }
  }

  render() {
    const { navigator } = this.props;

    return (
      <View style={styles.container}>
        <NavBar.Default title="Communication" source={images.communication} />
        <Contacts style={styles.contacts} phoneView />
        <Dock
          navigator={navigator}
          apps={this.state.appsBottom}
          onAppClick={::this.onAppClick}
          floatMode
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },

  contacts: {
    flex: 1,
  },
});