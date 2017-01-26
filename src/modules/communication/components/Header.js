import { Text } from 'ui';

const TITLES = {
  direct: 'DIRECT MESSAGES',
  groups: 'GROUPS',
};

export default function Header({ type }: PropTypes) {
  return (
    <Text>{TITLES[type]}</Text>
  );
}

type PropTypes = {
  type: string;
};