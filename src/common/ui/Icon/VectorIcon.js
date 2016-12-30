import { Text } from 'react-native';
//noinspection JSUnresolvedVariable
import vector from './vector.json';

export default function VectorIcon(props: Props) {
  let unicode;
  if (typeof props.source === 'string' && vector[props.source]) {
    const glyph = vector[props.source];
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

  log('Vector', props, unicode);

  return (
    <Text {...props} style={[props.style]}>
      {unicode}
    </Text>
  );
}

type Props = {
  style?: Object | number;
  source: Object | string;
}