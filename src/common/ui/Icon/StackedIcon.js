import { View } from 'react-native';
import StyleSheet from '../StyleSheet';
import componentFactory from './componentFactory';

export default function StackedIcon(props: Props) {
  const children = props.layers.map((meta, i) => {
    return componentFactory({
      ...meta,
      key: i,
      style: [styles.stacked, meta.style],
    });
  });

  return (
    <View {...props}>{children}</View>
  );
}

const styles = StyleSheet.create({
  stacked: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
});

type Props = {
  layers: Array<Object>;
  style?: Object | number;
};