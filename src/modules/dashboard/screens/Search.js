import { Component } from 'react';
import { Image, TextInput, TouchableWithoutFeedback, ListView } from 'react-native';
import { Button, Icon, Loader, StyleSheet, Text, View } from 'ui';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';

import type SearchStore, { SearchRow } from '../../../store/SearchStore';

@inject('search')
@observer
export default class SearchForm extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props:{
    navigator: Navigator;
    search: SearchStore;
  };

  state:{
    query: string;
  };

  $input:TextInput;

  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  onTextChange(query) {
    const { search } = this.props;
    this.setState({ query });
    search.search(query);
  }

  onClose() {
    const { navigator } = this.props;
    navigator.pop({ animated: false });
  }

  onFollow(row:SearchRow) {
    if (row.is_following) {
      this.props.search.unfollow(row.id);
    } else {
      this.props.search.follow(row.id);
    }
  }

  renderRow(row:SearchRow) {
    const isFollowUpdating = row.is_followUpdating;

    return (
      <View style={styles.row}>
        <Image style={styles.logo} source={row.logoSource} />
        <Text style={styles.title}>{row.name}</Text>
        <Button
          style={styles.followBtn}
          titleStyle={styles.followBtnTitle}
          title={row.is_following ? 'Unfollow' : 'Follow'}
          onPress={() => this.onFollow(row)}
          disabled={isFollowUpdating}
        />
      </View>
    );
  }

  render() {
    const { query } = this.state;
    const search:SearchStore = this.props.search;

    // It definition is to get mobx tracking this observable
    const isFollowingUpdating = search.isFollowUpdating; // eslint-disable-line
    const dataSource = this.dataSource.cloneWithRows(search.items.slice());

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            style={styles.icon}
            name="icon-search-16"
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
            name="icon-x-16"
            onPress={::this.onClose}
          />
        </View>

        {(!!query && !search.isSearching && search.items.length === 0) && (
        <Text style={styles.error}>{search.error}</Text>)}

        {!!query && (
          <View style={styles.results}>
            <Loader
              style={styles.spinner}
              isLoading={search.isSearching}
            >
              <ListView
                dataSource={dataSource}
                renderRow={::this.renderRow}
                contentContainerStyle={styles.results}
                keyboardShouldPersistTaps
                initialListSize={20}
              />
            </Loader>
          </View>
        )}

        {!query && (
          <TouchableWithoutFeedback onPress={::this.onClose}>
            <View style={{ flex: 1 }}/>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
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
    height: 54,
    paddingHorizontal: 20,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    '@media ios and (orientation: portrait)': {
      marginTop: 10,
    },
  },

  icon: {
    marginTop: 1,
    color: '$pe_icons_color',
    fontSize: '2.2rem',
  },

  spinner: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
  },

  error: {
    marginTop: 10,
  },

  input: {
    flex: 1,
    borderWidth: 0,
    color: '$pe_color_black',
    marginLeft: 3,
  },

  results: {
    flex: 1,
    alignSelf: 'stretch',
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
    flex: 1,
    paddingLeft: 15,
    color: '$pe_color_black',
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

  closeBtn: {
    padding: 5,
  },
});