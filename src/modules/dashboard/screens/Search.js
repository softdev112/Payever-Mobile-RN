import type SearchStore, { SearchRow } from '../../../store/SearchStore';

import { Component } from 'react';
import { Image, TextInput, TouchableWithoutFeedback, TouchableOpacity, ListView } from 'react-native';
import { Button, Icon, Loader, StyleSheet, Text, View } from 'ui';
import { inject, observer } from 'mobx-react/native';


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

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      query: '',
    };
  }

  componentWillReact() {
    console.log('props' + this.props.search.isFollowUnfollowUpdating);
  }

  onTextChange(query) {
    this.setState({ query });
    this.props.search.search(query);
  }

  onClose() {
    const { navigator } = this.props;
    navigator.pop({animated: true});
  }

  onFollow(row:SearchRow) {
    if (row.is_following) {
      this.props.search.unfollow(row.id);
    } else {
      this.props.search.follow(row.id);
    }

    this.setState({});
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
        renderSeparator={::this.renderSeparator}
        enableEmptySections
        keyboardShouldPersistTaps
        initialListSize={20}
      />
    );
  }

  renderRow(row:SearchRow) {
    return (
      <View style={styles.row}>
        <Image style={styles.logo} source={row.logoSource} />
        <Text style={styles.title}>{row.name}</Text>
        <Button
          titleStyle={styles.followBtnTitle}
          title={row.is_following ? 'Unfollow' : 'Follow'}
          onPress={this.onFollow.bind(this, row)}
          disabled={this.props.search.isFollowUnfollowUpdating}
        />
      </View>
    );
  }

  renderSeparator() {
    return (<View style={styles.separator} />);
  }

  render() {
    const { query } = this.state;
    const search:SearchStore = this.props.search;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={::this.onClose}>
              <View style={styles.menuItems}>
                <Icon
                  style={styles.backIcon}
                  name="icon-arrow-left-ios-16"
                />
                <Text style={styles.backTitle}>Dashboard</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.searchGroup}>
            <Icon
              style={styles.searchIcon}
              name="icon-search-16"
            />
            <TextInput
              style={styles.input}
              ref={i => this.$input = i}
              onChangeText={text => this.onTextChange(text)}
              autoFocus
              autoCorrect={false}
              multiline={false}
              placeholder="Search for business"
              returnKeyType="search"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View style={styles.results}>
          <Loader
            isLoading={search.isSearching}
            style={{ flex: 1 }}
          >
            {this.renderList()}
          </Loader>
        </View>
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
    alignItems: 'center',
    height: '10%',
    marginBottom: 10,
  },

  menu: {
    height: '5%',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    paddingVertical: '1rem',
    paddingHorizontal: 5,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  menuItems: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },

  searchGroup: {
    height: '5%',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'red',
    width: '80%',
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    '@media ios and (orientation: portrait)': {
      marginTop: 10
    }
  },

  input: {
    marginLeft: 2,
    flex: 1,
    borderWidth: 0,
    padding: 2,
    color: 'black',
    fontSize: '1.2rem'
  },

  results: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'

  },

  listInsideContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  },

  $rowSizeHeight: '15%',

  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem',
    height: '$rowSizeHeight',
    width: '$rowSizeHeight',
  },

  followBtnTitle: {
    fontSize: '1.2rem'
  },

  separator: {
    width: 10,
    height: '$rowSizeHeight'
  },

  searchIcon: {
    color: '#b5b9be',
    fontSize: '1.2rem'
  },

  backIcon: {
    color: '$pe_color_blue',
    fontSize: '1.2rem'
  },

  backTitle: {
    color: '$pe_color_blue',
    fontSize: '1.2rem'
  },

  logo: {
    width: 32,
    height: 32,
    borderRadius: 16
  },

  title: {
    flex: 1,
    paddingLeft: 15,
    color: 'black'
  }
});