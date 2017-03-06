/* eslint-disable */
import { Component } from 'react';
import { ART, WebView } from 'react-native';
import { NavBar, View, StyleSheet, Button } from 'ui';
import { Navigator } from 'react-native-navigation';

import svgIcons from './icons';

const {
  Surface,
  Group,
  Rectangle,
  ClippingRectangle,
  LinearGradient,
  Shape,
} = ART;

var Morph = require('art/morph/path');
var pathsChannel0 = svgIcons.map((svg) => Morph.Path(svg[0].path));
var pathsChannel1 = svgIcons.map((svg) => Morph.Path(svg[1].path));
var pathsChannel2 = svgIcons.map((svg) => Morph.Path(svg[2].path));

export default class Debug extends Component {
  static navigatorStyle = { navBarHidden: true };

  props:{
    navigator: Navigator;
  };

  state: {
    transition0: Object;
    transition1: Object;
    transition2: Object;
  };

  constructor(props) {
    super(props);

    this.nextAnimation = this.nextAnimation.bind(this);
    this.state = {
      transition0: Morph.Tween(pathsChannel0[0], pathsChannel0[1]),
      transition1: Morph.Tween(pathsChannel1[0], pathsChannel1[1]),
      transition2: Morph.Tween(pathsChannel2[0], pathsChannel2[1]),
    };
  }

  componentWillMount() {
    this._current = 1;
  }

  componentDidMount() {
    this.animate(null, this.nextAnimation);
  }

  onPlayAgain() {
    this._current = 1;
    this.setState({
      transition0: Morph.Tween(pathsChannel0[0], pathsChannel0[1]),
      transition1: Morph.Tween(pathsChannel1[0], pathsChannel1[1]),
      transition2: Morph.Tween(pathsChannel2[0], pathsChannel2[1]),
    });

    this.animate(null, this.nextAnimation);
  }

  nextAnimation() {
    this._current += 1;
    if (this._current >= pathsChannel0.length) return;
    this.setState({
      transition0: Morph.Tween(pathsChannel0[this._current - 1], pathsChannel0[this._current]),
      transition1: Morph.Tween(pathsChannel1[this._current - 1], pathsChannel1[this._current]),
      transition2: Morph.Tween(pathsChannel2[this._current - 1], pathsChannel2[this._current])
    }, () => this.animate(null, this.nextAnimation))
  }

  animate(start, cb) {
    requestAnimationFrame((timestamp) => {
      if (!start) start = timestamp;
      var delta = (timestamp - start) / 1000;
      if (delta > 1) return cb();
      this.state.transition0.tween(delta);
      this.state.transition1.tween(delta);
      this.state.transition2.tween(delta);
      this.setState(this.state);
      this.animate(start, cb);
    });
  }

  render() {
    const { inspectObj } = this.props;

    return (
      <View style={styles.container}>
        <NavBar.Default />
        <View style={styles.svgContainer}>
          <Surface width={400} height={300}>
            <Shape
              scale={3}
              x={70}
              y={70}
              d={this.state.transition0}
              fill={svgIcons[this._current][0].fill}
              stroke={svgIcons[this._current][0].stroke}
              opacity={svgIcons[this._current][0].opacity}
            />
            <Shape
              scale={3}
              x={70}
              y={70}
              d={this.state.transition1}
              fill={svgIcons[this._current][1].fill}
              stroke={svgIcons[this._current][1].stroke}
              opacity={svgIcons[this._current][1].opacity}
            />
            <Shape
              scale={3}
              x={70}
              y={70}
              d={this.state.transition2}
              fill={svgIcons[this._current][2].fill}
              stroke={svgIcons[this._current][2].stroke}
              opacity={svgIcons[this._current][2].opacity}
            />
          </Surface>
          <Button
            style={styles.button}
            title="Play Again"
            onPress={::this.onPlayAgain}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    alignSelf: 'center',
  },

  container: {
    flex: 1
  },

  svgContainer: {
  },


});