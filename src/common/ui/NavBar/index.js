import { Children, Component } from 'react';
import { View } from 'react-native';

import StyleSheet from '../StyleSheet';
import NavBarItem from './NavBarItem';

export default class NavBar extends Component {
  props: {
    style?: Object;
    children: Array<Component>;
  };

  static Back({ title, onPress }) {
    return (
      <NavBarItem
        onPress={onPress}
        source="icon-arrow-left-ios-24"
        title={title}
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

  static Menu({ source, onPress }) {
    return (
      <NavBarItem
        imageStyle={styles.menuProfileImg}
        onPress={onPress}
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

    Children.forEach(children, (child: Component) => {
      //noinspection JSUnresolvedVariable
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

NavBar.Back.defaultProps = { block: 'left' };

NavBar.Menu.defaultProps = { block: 'right' };

NavBar.Title.defaultProps = { block: 'mid' };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  leftZone: {
    flex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 2,
    paddingLeft: 20,
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
    paddingRight: 20,
  },

  titleImg: {
    shadowColor: 'rgba(0,0,0,.15)',
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    borderRadius: 8,
    elevation: 2,
  },

  titleText: {
    color: '#3d3d3d',
    marginLeft: 6,
  },

  menuProfileImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});