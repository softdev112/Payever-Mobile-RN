import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { findNodeHandle, ScrollView } from 'react-native';
import { FlatPicker, FlatTextInput, NavBar, StyleSheet, View } from 'ui';
import ProfilesStore from '../../../store/profiles';

const KEYBOARD_SCROLL_ADJUST = 80;

@inject('profiles')
@observer
export default class AddNewBusiness extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    profiles?: ProfilesStore;
  };

  state: {
    name: string;
    scrollEnabled: boolean;
    inputNodeId: number;
  };

  $nameTextInput: FlatTextInput;
  $scrollView: ScrollView;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      scrollEnabled: false,
      inputNodeId: -1,
    };
  }

  onCreateBusiness() {
  }

  onInputInFocus({ nativeEvent }) {
    setTimeout(() => {
      const scrollResponder = this.$scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(nativeEvent.target),
        KEYBOARD_SCROLL_ADJUST,
        true
      );
    }, 50);

    this.setState({ inputNodeId: nativeEvent.target });
  }

  onInputBlur({ nativeEvent }) {
    setTimeout(() => {
      // Scroll back only if there are no inputs in focus
      if (this.state.inputNodeId === -1) {
        const scrollResponder = this.$scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          findNodeHandle(nativeEvent.target),
          0,
          true
        );
      }
    }, 50);

    this.setState({ inputNodeId: -1 });
  }

  render() {
    // const profile = this.props.profiles.currentProfile;
    const { scrollEnabled } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Add New Business" />
          <NavBar.Button title="Save" onPress={::this.onCreateBusiness} />
        </NavBar>
        <ScrollView
          scrollEnabled={scrollEnabled}
          contentContainerStyle={styles.content}
          ref={ref => this.$scrollView = ref}
        >
          <FlatTextInput
            ref={ref => this.$nameTextInput = ref}
            placeholder="Company Name"
            onChangeText={text => this.setState({ name: text })}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={this.state.name}
          />
          <FlatPicker />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$nameTextInput = ref}
            placeholder="Phone"
            onChangeText={text => this.setState({ name: text })}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={this.state.name}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$nameTextInput = ref}
            placeholder="Country"
            onChangeText={text => this.setState({ name: text })}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={this.state.name}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$nameTextInput = ref}
            placeholder="City"
            onChangeText={text => this.setState({ name: text })}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={this.state.name}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$nameTextInput = ref}
            placeholder="Zip Code"
            onChangeText={text => this.setState({ name: text })}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={this.state.name}
          />
          <FlatTextInput
            inputStyle={styles.subFieldsText}
            ref={ref => this.$nameTextInput = ref}
            placeholder="Address"
            onChangeText={text => this.setState({ name: text })}
            onFocus={::this.onInputInFocus}
            onBlur={::this.onInputBlur}
            value={this.state.name}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  subFieldsText: {
    fontSize: 18,
  },
});