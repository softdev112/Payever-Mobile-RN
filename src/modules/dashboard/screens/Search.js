import { Component } from 'react';
import { Image, TextInput, TouchableWithoutFeedback, TouchableOpacity, ListView } from 'react-native';
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

    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
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

  onFollow(row: SearchRow) {
    if (row.is_following) {
      this.props.search.unfollow(row.id);
    } else {
      this.props.search.follow(row.id);
    }
  }

  renderRow(row: SearchRow) {
    const isFollowUpdating = row.is_followUpdating;

    return (
      <View style={styles.row}>
        <Image style={styles.logo} source={row.logoSource} />
        <Text style={styles.title}>{row.name}</Text>
        <Button
          style={styles.followBtn}
          titleStyle={styles.followBtnTitle}
          title={row.is_following ? 'Unfollow' : 'Follow'}
          onPress={() => ::this.onFollow(row)}
          disabled={isFollowUpdating}
        />
      </View>
    );
  }

  render() {
    const { query } = this.state;
    const search: SearchStore = this.props.search;
    const isFollowingUpdating = search.isFollowUpdating; // It definition is to get mobx tracking this observable
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
          <TouchableOpacity
            onPress={::this.onClose}
          >
            <Icon
              style={styles.icon}
              name="icon-close-16"
            />
          </TouchableOpacity>
        </View>

        <Text>{search.error}</Text>

        {!!query && (
          <View style={styles.results}>
            <Loader isLoading={search.isSearching} style={{ flex: 1 }}>
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
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        )}
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
    height: 54,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    '@media ios and (orientation: portrait)': {
      marginTop: 10,
    },
  },

  icon: {
    marginTop: 1,
    color: '#b5b9be',
  },

  input: {
    flex: 1,
    borderWidth: 0,
    color: 'black',
  },

  results: {
    flex: 1,
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
    color: 'black',
  },

  followBtnTitle: {
    fontSize: '1.1rem',
    fontWeight: '100',
    color: '#0084ff',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
  },

  followBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderColor: '#0084ff',
    borderWidth: 0.7,
  },
});