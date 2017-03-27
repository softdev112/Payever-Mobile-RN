import { Component } from 'react';
import { Switch } from 'react-native';
import { StyleSheet, Text, View } from 'ui';

import type SavedContact from '../../../../store/profiles/models/SavedContact';

export default class SavedContactView extends Component {
  props: {
    contact: SavedContact;
    initValue: boolean;
    onSelectedChange: (contact: SavedContact) => void;
  };

  state: {
    switchValue: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      switchValue: props.initValue || false,
    };
  }

  onValueChange() {
    const { contact, onSelectedChange } = this.props;
    const { switchValue } = this.state;

    onSelectedChange(contact);
    this.setState({ switchValue: !switchValue });
  }

  render() {
    const { contact } = this.props;
    const { switchValue } = this.state;
    const { first_name, last_name, email, country, city, street } = contact;

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          {!!first_name && (
            <Text style={styles.text} numberOfLines={1}>
              {first_name}
            </Text>
          )}
          {!!last_name && (
            <Text style={styles.text} numberOfLines={1}>
              {last_name}
            </Text>
          )}
          {!!email && (
            <Text style={styles.text} numberOfLines={1}>
              {email}
            </Text>
          )}
          {(!!city || !!country || !!street) && (
            <Text style={styles.text} numberOfLines={1}>
              {country} {city} {street}
            </Text>
          )}
        </View>
        <Switch
          value={switchValue}
          onValueChange={::this.onValueChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 70,
  },

  textContainer: {
    flex: 1,
  },

  text: {
    fontSize: 16,
  },
});