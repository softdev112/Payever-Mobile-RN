import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { Image, StyleSheet, Text, View } from 'ui';

import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type BusinessProfile
  from '../../../store/UserProfilesStore/BusinessProfile';

import imgChecked from '../images/checkMarkPressed.png';


@observer
export default class BusinessList extends Component {
  props: {
    onSelect: (profile: BusinessProfile) => {},
    userProfiles: UserProfilesStore
  };

  renderRow(profile: BusinessProfile) {
    const { userProfiles, onSelect } = this.props;
    return (
      <TouchableOpacity
        style={styles.row}
        key={profile.id}
        onPress={() => onSelect(profile)}
      >
        <Image style={styles.logo} source={profile.logoSource} />
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {profile.displayName}
          </Text>
          <Text style={styles.stores}>{profile.stores} stores</Text>
        </View>
        {profile === userProfiles.currentProfile && (
          <Image source={imgChecked} style={styles.imgChecked} />
        )}
      </TouchableOpacity>
    );
  }

  render() {
    const { userProfiles } = this.props;
    const profiles = userProfiles.toArray(false);
    return (
      <View style={styles.container}>
        {profiles.map(::this.renderRow)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '$border_color',
  },

  row: {
    flexDirection: 'row',
    marginLeft: 16,
    paddingTop: 15,
    paddingRight: 19,
    paddingBottom: 15,
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: '$border_color',
  },

  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  imgChecked: {
    width: 24,
    height: 24,
  },

  title: {
    color: '$pe_color_dark_gray',
  },

  stores: {
    color: '$pe_color_gray_2',
  },

  text: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 8,
  },
});