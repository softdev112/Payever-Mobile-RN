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

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={1}>
            {contact.first_name}
          </Text>
          <Text style={styles.text} numberOfLines={1}>{contact.last_name}</Text>
          <Text style={styles.text} numberOfLines={1}>{contact.email}</Text>
          <Text style={styles.text} numberOfLines={1}>
            {contact.country} {contact.city} {contact.street}
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
  },

  text: {
    fontSize: 16,
  },
});