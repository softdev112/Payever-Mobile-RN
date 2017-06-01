import { Component } from 'react';
import { Animated, TextInput, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import Icon from '../../Icon';
import StyleSheet from '../../StyleSheet';
import TextButton from '../../TextButton';
import NavBarItem from '../NavBarItem';

import CommunicaitonStore from '../../../../store/communication';

@inject('communication', 'ui')
@observer
export default class SearchItem extends Component {
  static defaultProps = {
    align: 'center',
  };

  props: {
    onPress: () => void;
    onCancel: () => void;
    communication: CommunicaitonStore;
  };

  state: {
    text: string;
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      animValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.animValue, {
      toValue: 1,
      duration: 200,
    }).start();
  }

  onClearText() {
    const { communication } = this.props;
    communication.searchMessages('');
    this.setState({ text: '' });
  }

  async onChangeText(text) {
    const { communication } = this.props;
    communication.searchMessages(text);
    this.setState({ text });
  }

  onCancel() {
    const { onCancel, communication } = this.props;

    Animated.timing(this.state.animValue, {
      toValue: 0,
      duration: 150,
    }).start(() => {
      this.setState({ text: '' }, () => {
        if (onCancel) {
          onCancel();
        }

        communication.ui.setSearchMessagesMode(false);
        communication.clearFoundMessages();
      });
    });
  }

  render() {
    const { onPress } = this.props;
    const { animValue, text } = this.state;

    return (
      <NavBarItem style={styles.leftAdjust} onPress={onPress}>
        <Animated.View
          style={[styles.searchContainer, { opacity: animValue }]}
        >
          <View style={styles.inputContainer}>
            <Icon
              style={styles.searchIcon}
              source="icon-search-16"
            />
            <TextInput
              style={styles.input}
              autoCorrect={false}
              autoFocus
              placeholder={'Search in messages'}
              placeholderTextColor="#b5b9be"
              underlineColorAndroid="transparent"
              value={text}
              onChangeText={::this.onChangeText}
              numberOfLines={1}
            />
            {text !== '' && (
              <Icon
                style={styles.clearIcon}
                source="icon-x-solid-24"
                onPress={::this.onClearText}
              />
            )}
          </View>
          <TextButton
            style={styles.cancelBtn}
            title="Cancel"
            onPress={::this.onCancel}
          />
        </Animated.View>
      </NavBarItem>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    height: 34,
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },

  inputContainer: {
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '$pe_color_apple_div',
    borderRadius: 4,
    paddingHorizontal: 4,
    marginRight: 4,
  },

  leftAdjust: {
    left: -10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },

  searchIcon: {
    fontSize: 15,
    paddingHorizontal: 6,
    color: '$pe_color_icon',
  },

  clearIcon: {
    fontSize: 15,
    paddingHorizontal: 5,
    color: '$pe_color_icon',
  },

  cancelBtn: {
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
});