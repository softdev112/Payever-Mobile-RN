import { StyleSheet, Text, View } from 'ui';

export default function DashboardTitle({ title1, title2 }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title1}>{title1.toUpperCase()}</Text>
      <Text style={styles.title2}>{title2}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    '@media (min-height: 700)': {
      paddingTop: 20,
      paddingBottom: 10,
    },
  },

  title1: {
    color: '$pe_color_gray_2',
    '@media (max-height: 640)': {
      height: 0,
    },
  },

  title2: {
    color: '$pe_color_dark_gray',
    fontSize: 28,
    fontFamily: 'Open Sans_light',
    '@media ios': {
      fontFamily: 'HelveticaNeue-UltraLight',
    },
    '@media (max-height: 600)': {
      height: 0,
    },
    '@media (min-height: 700)': {
      fontSize: 34,
    },
    '@media (min-height: 730)': {
      fontSize: 44,
    },
  },
});

type Props = {
  title1: string;
  title2: string;
}