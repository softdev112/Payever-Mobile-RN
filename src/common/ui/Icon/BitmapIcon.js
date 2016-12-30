import { Image } from 'react-native';
import StyleSheet from '../StyleSheet';

export default function BitmapIcon(props: Props) {
  const style = Object.assign({}, StyleSheet.flatten(props.style));
  if (style.color) {
    style.tintColor = style.color;
    delete style.color;
  }

  return (
    <Image {...props} />
  );
}

type Props = {
  style?: Object | number;
}