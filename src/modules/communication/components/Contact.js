import { Text } from 'ui';

export default function Contact({ item }: PropTypes) {
  return (
    <Text>{item.name}</Text>
  );
}

type PropTypes = {
  item: Object;
};