import { Component } from 'react';
import NavBarItem from './NavBarItem';

export default class ComplexTitle extends Component {
  static defaultProps = {
    align: 'center',
  };

  props: {
    children?: Array<Component>;
    onPress?: Function;
  };

  render() {
    const { children, onPress } = this.props;

    return (
      <NavBarItem onPress={onPress}>
        {children}
      </NavBarItem>
    );
  }
}