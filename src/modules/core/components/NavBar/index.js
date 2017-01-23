/**
 * Created by Elf on 17.01.2017.
 */
import React, { Component } from 'react';
import { View, StyleSheet } from 'ui';

import { toggleMenu } from '../../../../common/Navigation';
import NavBarItem from './NavBarItem';

export default class NavBar extends Component {
  props: {
    style?: Object;
    children: Array<Component>;
  };

  static Back({ title, onPress }, context) {
    const navigator = context.navigator;
    const onPressAction = onPress || navigator.pop;

    return (
      <NavBarItem
        title={title}
        source="icon-arrow-left-ios-24"
        onPress={() => onPressAction()}
      />
    );
  }

  static IconButton({ title, source, align, onPress }) {
    return (
      <NavBarItem
        align={align}
        onPress={() => onPress()}
        source={source}
        title={title}
      />
    );
  }

  static Menu({ source, onPress }, context) {
    const navigator = context.navigator;
    const onPressAction = onPress ?
      () => onPress() : () => toggleMenu(navigator);

    return (
      <NavBarItem
        imageStyle={styles.menuProfileImg}
        onPress={onPressAction}
        source={source}
      />
    );
  }

  static Title({ title, source }) {
    return (
      <NavBarItem
        imageStyle={styles.titleImg}
        source={source}
        title={title}
        titleStyle={styles.titleText}
      />
    );
  }

  render() {
    const leftChildren = [];
    const middleChildren = [];
    const rightChildren = [];

    const { children, style } = this.props;

    React.Children.forEach(children, (child) => {
      switch (child.props.block) {
        case 'left': {
          leftChildren.push(child);
          break;
        }

        case 'mid': {
          middleChildren.push(child);
          break;
        }

        case 'right': {
          rightChildren.push(child);
          break;
        }

        default: {
          leftChildren.push(child);
          break;
        }
      }
    });

    return (
      <View style={[styles.container, style]}>
        <View style={styles.leftZone}>
          {leftChildren}
        </View>

        <View style={styles.middleZone}>
          {middleChildren}
        </View>

        <View style={styles.rightZone}>
          {rightChildren}
        </View>
      </View>
    );
  }
}

NavBar.Back.contextTypes = { navigator: React.PropTypes.object };
NavBar.Back.defaultProps = { block: 'left' };

NavBar.Menu.contextTypes = { navigator: React.PropTypes.object };
NavBar.Menu.defaultProps = { block: 'right' };

NavBar.Title.defaultProps = { block: 'mid' };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexBasis: 10,
    minHeight: 40,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  leftZone: {
    flex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 2,
    paddingLeft: 5,
  },

  middleZone: {
    flex: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },

  rightZone: {
    flex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 2,
    paddingRight: 5,
  },

  titleImg: {
    shadowColor: 'rgba(0,0,0,.06)',
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },

  titleText: {
    color: '#3d3d3d',
    marginLeft: 5,
  },

  menuProfileImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});