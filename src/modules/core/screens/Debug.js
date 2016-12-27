/* eslint-disable */

import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { action } from 'mobx';
import { ListView } from 'react-native';
import { Button, StyleSheet, Text, View } from 'ui';
import SearchStore, { SearchRow }  from '../../../store/SearchStore';

@inject('search')
@observer
export default class Debug extends Component {
  props: {
    navigator: Navigator;
    search: SearchStore;
  };

  onSearchClick() {
    action('Search', () => {
      this.props.search.search(Math.random().toString(36).substr(2, 1));
    })();
  }

  onRowClick(row: SearchRow) {
    if (row.is_following) {
      this.props.search.unfollow(row.id)
    } else {
      this.props.search.follow(row.id)
    }
  }

  renderRow(row: SearchRow) {
    return (
      <Text onPress={() => this.onRowClick(row)}>
        {row.name} {row.is_following ? '1' : '0'}
      </Text>
    );
  }

  render() {
    const { search } = this.props;

    log('Render', search.items);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    const itemsDs = dataSource.cloneWithRows(search.items.slice());

    return (
      <View style={styles.container}>
        <Text>
          {this.props.search.isFollowUnfollowUpdating ? 'updating' : ''}
        </Text>

        <Button title="Search" onPress={::this.onSearchClick} />
        <ListView
          dataSource={itemsDs}
          renderRow={::this.renderRow}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
});