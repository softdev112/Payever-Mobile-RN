import { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { ScreenParams } from '../../utils';
import StyleSheet from '../StyleSheet';

const MENU_HEIGHT = 35;
const BUTTON_WIDTH = 70;

const MENU_TOP_APPEARENCE = 75;

const DEFAULT_Y_POS = 20;
const DEFAULT_X_POS = 10;
const POSITION_Y_ADJUST = 130;
const POSITION_X_ADJUST = 20;

const ARROW_X_POS = [[35, 35, 100], [35, 150, 245]];

export default class PopupMenu extends Component {
  static contextTypes = {
    navigator: PropTypes.object,
  };

  static defaultProps = {
    posY: DEFAULT_Y_POS,
    posX: DEFAULT_X_POS,
    maxX: ScreenParams.width,
  };

  props: {
    posY?: number;
    posX?: number;
    maxX?: number;
    style?: Object;
    actions: Array<Action>;
    dismissAction: Function;
  };

  state: {
    isAbovePoint: boolean;
  };

  $container: Animatable.View;

  constructor(props) {
    super(props);

    this.state = {
      isAboveTouch: props.posY - MENU_TOP_APPEARENCE > MENU_HEIGHT + 16,
    };
  }

  componentWillReceiveProps(newProps) {
    const { posY } = this.props;

    if (posY !== newProps.posY) {
      this.setState({
        isAboveTouch: newProps.posY - MENU_TOP_APPEARENCE > MENU_HEIGHT + 16,
      });
    }
  }

  async onDismiss() {
    const { dismissAction } = this.props;

    if (this.$container) {
      await this.$container.zoomOut(300);
    }

    if (dismissAction) {
      dismissAction();
    }
  }

  getMenuXPos(touchX) {
    const { actions, maxX } = this.props;
    const btnsWidth = actions.length * BUTTON_WIDTH;

    if (maxX - touchX <= btnsWidth) {
      return maxX - btnsWidth - 8;
    } else if (touchX <= POSITION_X_ADJUST) {
      return 8;
    }

    return touchX - POSITION_X_ADJUST;
  }

  getMenuYPos(touchY) {
    const { isAboveTouch } = this.state;

    if (isAboveTouch) {
      return touchY - POSITION_Y_ADJUST;
    }

    return touchY - MENU_HEIGHT;
  }

  getArrowXPos(touchX) {
    const { actions, maxX } = this.props;
    const view30PerWidth = maxX * 0.3;
    const arrowXPosSetIndex = actions.length > 2 ? 1 : 0;

    if (touchX <= view30PerWidth) {
      return ARROW_X_POS[arrowXPosSetIndex][0];
    } else if (touchX >= view30PerWidth && touchX < 2 * view30PerWidth) {
      return ARROW_X_POS[arrowXPosSetIndex][1];
    }

    return ARROW_X_POS[arrowXPosSetIndex][2];
  }

  renderActions() {
    const { actions } = this.props;

    return actions.map((action, index) => {
      const borderStyle = {
        borderLeftColor: '#616264',
        borderLeftWidth: 2,
      };

      return (
        <View
          key={index}
          style={[styles.btnContainer, index > 0 ? borderStyle : null]}
        >
          <TouchableOpacity
            style={styles.btn}
            onPress={action.action}
          >
            <Text style={styles.btnText}>{action.title}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }


  render() {
    const { style, posY, posX } = this.props;
    const { isAboveTouch } = this.state;

    const arrowStyle = isAboveTouch ? styles.downTriangle : styles.upTriangle;

    return (
      <Animatable.View
        style={[styles.container, style, {
          top: this.getMenuYPos(posY),
          left: this.getMenuXPos(posX),
        }]}
        ref={ref => this.$container = ref}
        animation="zoomIn"
        duration={300}
      >
        <View
          style={styles.buttonsRow}
        >
          {this.renderActions()}
        </View>
        <View style={[arrowStyle, { left: this.getArrowXPos(posX) }]} />
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D2E30',
    height: MENU_HEIGHT,
    left: DEFAULT_X_POS,
    top: DEFAULT_Y_POS,
    borderRadius: 10,
    zIndex: 100,
  },

  buttonsRow: {
    flexDirection: 'row',
    flex: 1,
  },

  btnContainer: {
    justifyContent: 'center',
  },

  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 30,
    width: BUTTON_WIDTH,
  },

  btnText: {
    fontSize: 15,
    color: '#FFF',
  },

  downTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    bottom: -8,
    left: 245,
    borderColor: '#2D2E30',
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },

  upTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    top: -8,
    left: 245,
    borderColor: '#2D2E30',
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
});

type Action = {
  title: string;
  action: Function;
};