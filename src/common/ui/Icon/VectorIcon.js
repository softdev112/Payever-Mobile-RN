import { Text } from 'react-native';
import meta from './meta';

export default function VectorIcon(props: Props) {
  let unicode;
  if (typeof props.source === 'string' && meta[props.source]) {
    const glyph = meta[props.source];
    unicode = glyph.source.unicode;
    props = {
      ...props,
      style: [glyph.style, props.style],
    };
  } else if (props.source.unicode) {
    unicode = props.source.unicode;
  } else {
    throw new Error(
      'Wrong vector Icon source property: ' + JSON.stringify(props.source)
    );
  }

  delete props.onPress;

  return (
    <Text {...props} style={props.style}>
      {unicode}
    </Text>
  );
}

type Props = {
  style?: Object | number;
  source: Object | string;
};