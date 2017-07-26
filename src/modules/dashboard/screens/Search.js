import { Component } from 'react';
import {
  Image, TextInput, TouchableWithoutFeedback, TouchableOpacity, FlatList,
} from 'react-native';
import { Icon, Loader, SpinnerButton, StyleSheet, Text, View } from 'ui';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';

import type SearchStore, { SearchRow } from '../../../store/search';
import BusinessProfile from '../../../store/profiles/models/BusinessProfile';
import PersonalProfile from '../../../store/profiles/models/PersonalProfile';

@inject('search')
@observer
export default class SearchForm extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    search: SearchStore;
  };

  state: {
    query: string;
  };

  $input: TextInput;

  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  onProfilePress(profile: PersonalProfile | BusinessProfile) {
    const { navigator } = this.props;

    navigator.showModal({
      screen: 'dashboard.ProfileInfoWebView',
      passProps: { profile },
    });
  }

  onTextChange(query) {
    const { search } = this.props;
    this.setState({ query });
    search.search(query);
  }

  onClose() {
    const { navigator } = this.props;
    navigator.pop({ animated: true });
  }

  onFollow(business: SearchRow) {
    if (business.is_following) {
      this.props.search.unfollow(business.id);
    } else {
      this.props.search.follow(business.id);
    }
  }

  renderItem({ item }: SearchRow) {
    const RowComponent = observer(({ business }) => {
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.onProfilePress(business)}
        >
          <Image style={styles.logo} source={business.logoSource} />
          <Text style={styles.title}>{business.name}</Text>
          <SpinnerButton
            style={styles.followBtn}
            titleStyle={styles.followBtnTitle}
            title={business.is_following ? 'Unfollow' : 'Follow'}
            onPress={() => this.onFollow(business)}
            disabled={business.is_followUpdating}
          />
        </TouchableOpacity>
      );
    });

    return <RowComponent business={item} />;
  }

  render() {
    const { query } = this.state;
    const { search } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            style={styles.icon}
            source="icon-search-16"
          />
          <TextInput
            style={styles.input}
            ref={i => this.$input = i}
            onChangeText={t => this.onTextChange(t)}
            autoFocus
            autoCorrect={false}
            multiline={false}
            placeholder="Search for business"
            returnKeyType="search"
            underlineColorAndroid="transparent"
          />
          <Icon
            style={styles.icon}
            source="icon-x-16"
            onPress={::this.onClose}
          />
        </View>

        {(!!query && !search.isSearching && search.items.length === 0) && (
        <Text style={styles.error}>{search.error}</Text>)}

        {!!query && (
          <Loader
            style={styles.spinner}
            isLoading={search.isSearching}
          >
            <FlatList
              data={search.items.slice()}
              renderItem={::this.renderItem}
              keyboardShouldPersistTaps="always"
              initialListSize={3}
              keyExtractor={i => i.id}
            />
          </Loader>
        )}

        <TouchableWithoutFeedback onPress={::this.onClose}>
          <View style={styles.freeSpace} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '$pe_color_white',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 20,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    '@media ios': {
      marginTop: 10,
    },
  },

  icon: {
    color: '$pe_color_icon',
    fontSize: 16,
  },

  spinner: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
  },

  error: {
    marginTop: 10,
    alignSelf: 'center',
  },

  input: {
    flex: 1,
    borderWidth: 0,
    fontSize: 16,
    color: '$pe_color_black',
    '@media ios': {
      marginLeft: 8,
    },
    '@media android': {
      marginLeft: 5,
    },
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingLeft: 15,
    paddingRight: 12,
  },

  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  title: {
    color: '$pe_color_black',
    flex: 1,
    fontWeight: '400',
    paddingLeft: 15,
  },

  followBtnTitle: {
    fontSize: '1.4rem',
    color: '$pe_color_blue',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  followBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$pe_color_white',
    borderColor: '$pe_color_blue',
    borderWidth: 1,
  },

  freeSpace: {
    flex: 100,
    backgroundColor: 'transparent',
  },
});