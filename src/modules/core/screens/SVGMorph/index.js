import { Component } from 'react';
import { ART } from 'react-native';
import { NavBar, View, StyleSheet, Button } from 'ui';
import { Navigator } from 'react-native-navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Morph from 'art/morph/path';

import svgIcons from './icons';

const {
  Surface,
  Shape,
} = ART;

const emptyPath = 'M 50, 50';

const NUMBER_OF_CHANNELS = 9;

const animationPaths = [];
const pathsAtributes = [];
svgIcons.forEach((icon, iconIndex) => {
  for (let i = 0; i < NUMBER_OF_CHANNELS; i += 1) {
    if (!animationPaths[i]) animationPaths[i] = [];
    animationPaths[i][iconIndex] = Morph.Path(
      icon[i] ? icon[i].path : emptyPath
    );

    if (!pathsAtributes[i]) pathsAtributes[i] = [];
    pathsAtributes[i][iconIndex] = {
      fill: icon[i] ? icon[i].fill : undefined,
      stroke: icon[i] ? icon[i].stroke : undefined,
      opacity: icon[i] ? icon[i].opacity : undefined,
    };
  }
});

export default class Debug extends Component {
  static navigatorStyle = { navBarHidden: true };

  props: {
    navigator: Navigator;
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

  componentWillMount() {
    this.currentIcon = 1;
    this.currentIconColor = 0;
  }

  componentDidMount() {
    this.animate(null, this.nextAnimation);
  }

  onPlayAgain() {
    this.currentIcon = 1;
    this.currentIconColor = 0;

    this.state = {
      transitions: this.getTransitionsForIndex(0),
    };

    this.animate(null, this.nextAnimation);
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
      const delta = (timestamp - start) / 1000;

      if (delta > 1) return cb();

      this.state.transitions.forEach(transition => transition.tween(delta));
      this.setState(this.state);
      this.animate(start, cb);
    });
  }

  renderTransitions() {
    return this.state.transitions.map((transition, index) => {
      return (
        <Shape
          key={index}
          scale={3}
          x={70}
          y={70}
          d={transition}
          {...pathsAtributes[index][this.currentIcon]}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar.Default />
        <View>
          <Surface width={400} height={300}>
            {this.renderTransitions()}
          </Surface>
          <Button
            style={styles.button}
            title="Play Again"
            onPress={::this.onPlayAgain}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    alignSelf: 'center',
  },

  container: {
    flex: 1,
  },
});