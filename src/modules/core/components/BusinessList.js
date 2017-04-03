import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { Icon, Image, StyleSheet, Text, View } from 'ui';

import type ProfilesStore from '../../../store/profiles';
import type BusinessProfile
  from '../../../store/profiles/models/BusinessProfile';

@observer
export default class BusinessList extends Component {
  props: {
    onSelect: (profile: BusinessProfile) => {};
    profiles: ProfilesStore;
  };

  renderRow(profile: BusinessProfile) {
    const { profiles, onSelect } = this.props;
    return (
      <TouchableOpacity
        style={styles.row}
        key={profile.id}
        onPress={() => onSelect(profile)}
      >
        <Image style={styles.logo} source={profile.logoSource} />
        <Text style={styles.title} numberOfLines={1}>
          {profile.displayName}
        </Text>
        {profile === profiles.currentProfile && (
          <Icon source="icon-checkbox-checked-24" style={styles.imgChecked} />
        )}
      </TouchableOpacity>
    );
  }

  render() {
    const { profiles } = this.props;
    return (
      <View style={styles.container}>
        {profiles.getAllProfiles(false).map(::this.renderRow)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: '$border_color',
    borderTopWidth: 1,
    flex: 1,
  },

  row: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '$border_color',
    borderBottomWidth: 1,
    marginLeft: 16,
    paddingBottom: 15,
    paddingLeft: 8,
    paddingRight: 19,
    paddingTop: 15,
  },

  logo: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },

  imgChecked: {
    color: '$pe_color_blue',
    marginTop: 4,
  },

  title: {
    color: '$pe_color_dark_gray',
    fontWeight: '400',
    paddingLeft: 20,
    paddingRight: 15,
  },
});