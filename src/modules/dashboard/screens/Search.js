import { Component } from 'react';
import { Image, TextInput, TouchableWithoutFeedback, TouchableOpacity, ListView, Keyboard } from 'react-native';
import { Button, Icon, Loader, StyleSheet, Text, View } from 'ui';
import { inject, observer } from 'mobx-react/native';

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

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      query: '',
    };
  }

  onTextChange(query) {
    this.setState({ query });
    this.props.search.search(query);
  }

  onClose() {
    const { navigator } = this.props;
    navigator.pop({ animated: true });
  }

  onFollow(row) {
    if (row.is_following) {
      this.props.search.unfollow(row.id);
    } else {
      this.props.search.follow(row.id);
    }
  }

  renderList() {
    if (!this.state.query) {
      return null;
    }

    const dataSource = this.ds.cloneWithRows(this.props.search.items.slice());

    return (
      <ListView
        contentContainerStyle={styles.listInsideContainer}
        dataSource={dataSource}
        renderRow={::this.renderRow}
        enableEmptySections
        keyboardShouldPersistTaps
        initialListSize={20}
      />
    );
  }

  renderRow(row:SearchRow, secId, index: Number) {
    const followBtnStyle = [row.is_following ? styles.unfollowBtn : styles.followBtn];
    const followBtnTitleStyle = [row.is_following ? styles.unfollowBtnTitle : styles.followBtnTitle];
    const isFollowUpdating = row.is_followUpdating;

    return (
      <View style={[styles.row, index === 0 ? { backgroundColor: '#CCC' } : null]}>
        <Image style={styles.logo} source={row.logoSource} />
        <Text style={styles.title}>{row.name}</Text>
        <Button
          style={followBtnStyle}
          titleStyle={followBtnTitleStyle}
          title={row.is_following ? 'Unfollow' : 'Follow'}
          onPress={this.onFollow.bind(this, row)}
          disabled={isFollowUpdating}
        />
      </View>
    );
  }

  render() {
    const { query } = this.state;
    const search:SearchStore = this.props.search;

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
            onChangeText={text => this.onTextChange(text)}
            value={this.state.query}
            autoFocus
            autoCorrect={false}
            multiline={false}
            placeholder="Search for business"
            returnKeyType="search"
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={::this.onClose}
          >
            <Icon
              style={styles.icon}
              name="icon-close-16"
            />
          </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss} >
          <View style={styles.results}>
            <Loader
              style={styles.spinner}
              isLoading={search.isSearching}
            >
              {this.renderList()}
            </Loader>
          </View>
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

  spinner: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'flex-start',
  },

  header: {
    alignItems: 'center',
    height: '8%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    '@media ios and (orientation: portrait)': {
      marginTop: 10,
    },
  },

  closeButton: {
    padding: 5,
  },

  input: {
    marginLeft: 2,
    height: '8%',
    flex: 1,
    borderWidth: 0,
    padding: 2,
    color: 'black',
    fontSize: '1.5rem',
  },

  results: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',

  },

  listInsideContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    height: '7%',
  },

  followBtnTitle: {
    fontSize: '1.2rem',
    color: '#0084ff',
  },

  followBtn: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderColor: '#0084ff',
    borderWidth: 1,
  },

  unfollowBtnTitle: {
    fontSize: '1.2rem',
    color: '#FFF',
  },

  unfollowBtn: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#0084ff',
    borderColor: '#0084ff',
    borderWidth: 1,
  },

  icon: {
    color: '#b5b9be',
    fontSize: '1.2rem',
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
});