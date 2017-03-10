import { Component } from 'react';
import { ART } from 'react-native';
import { View, StyleSheet } from 'ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Morph from 'art/morph/path';

import svgIcons from './icons';

const {
  Surface,
  Shape,
} = ART;

const PATH_END_MORPH_KOEF = 0.98;
const TRANSITION_DURATION = 1200;
const ICON_FREEZ_TIME = 200;

const emptyPath = 'M 50, 50';
const NUMBER_OF_CHANNELS = 9;
const DEFAULT_PATH_X = 10;
const DEFAULT_PATH_Y = 10;

const animationPaths = [];
const pathsAttributes = [];

for (let i = 0; i < NUMBER_OF_CHANNELS; i += 1) {
  animationPaths[i] = [];
  pathsAttributes[i] = [];

  svgIcons.forEach((icon, iconIndex) => {
    if (icon[i]) {
      animationPaths[i][iconIndex] = Morph.Path(icon[i].path);
      pathsAttributes[i][iconIndex] = {
        fill: icon[i].fill,
        stroke: icon[i].stroke,
        opacity: icon[i].opacity,
        x: icon[i].x || DEFAULT_PATH_X,
        y: icon[i].y || DEFAULT_PATH_Y,
      };
    } else {
      animationPaths[i][iconIndex] = Morph.Path(emptyPath);
      pathsAttributes[i][iconIndex] = {
        x: DEFAULT_PATH_X,
        y: DEFAULT_PATH_Y,
      };
    }
  });
}

export default class SvgIconsShow extends Component {
  props: {
    style: Object;
  };

  state: {
    transitions: Array<Object>;
  };

  constructor(props) {
    super(props);

    this.nextAnimation = this.nextAnimation.bind(this);

    this.state = {
      transitions: this.getTransitionsForIndex(0),
    };
  }

  async componentWillMount() {
    this.currentIcon = 1;
  }

  componentDidMount() {
    this.animate(null, this.nextAnimation);
  }

  shouldComponentUpdate() {
    // If animation end do not update component
    return this.currentIcon !== svgIcons.length;
  }

  getTransitionsForIndex(fromIndex) {
    const transitions = [];
    for (let i = 0; i < NUMBER_OF_CHANNELS; i += 1) {
      transitions[i] = Morph.Tween(
        animationPaths[i][fromIndex], animationPaths[i][fromIndex + 1]
      );
    }

    return transitions;
  }

  nextAnimation() {
    this.currentIcon += 1;
    // All paths were morphed
    if (this.currentIcon >= animationPaths[0].length) return;
    this.setState({
      transitions: this.getTransitionsForIndex(this.currentIcon - 1),
    }, () => this.animate(null, this.nextAnimation));
  }

  animate(start, cb) {
    // eslint-disable-next-line consistent-return
    requestAnimationFrame((timestamp) => {
      if (!start) start = timestamp;
      const delta = (timestamp - start) / TRANSITION_DURATION;

      this.state.transitions.forEach(transition => transition.tween(delta));
      this.setState(this.state);

      if (delta > PATH_END_MORPH_KOEF) {
        return setTimeout(() => cb(), ICON_FREEZ_TIME);
      }
      this.animate(start, cb);
    });
  }

  renderTransitions() {
    return this.state.transitions.map((transition, index) => {
      return (
        <Shape
          key={index}
          scale={3}
          d={transition}
          {...pathsAttributes[index][this.currentIcon]}
        />
      );
    });
  }

  render() {
    const { style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Surface width={250} height={250}>
          {this.renderTransitions()}
        </Surface>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});