import { StyleSheet, Text, View } from 'ui';

export default function DashboardTitle(
  { title1, title2, showOnSmallScreens = false }: Props
) {
  const containerStyle = [styles.container];
  const title1Style    = [styles.title1];
  const title2Style    = [styles.title2];

  if (!showOnSmallScreens) {
    containerStyle.push(styles.container_compact);
    title1Style.push(styles.title1_compact);
    title2Style.push(styles.title2_compact);
  }

  return (
    <View style={containerStyle}>
      <Text style={title1Style}>{title1.toUpperCase()}</Text>
      <Text style={title2Style}>{title2}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
  },

  container_compact: {
    '@media (min-height: 700)': {
      paddingTop: 20,
      paddingBottom: 10,
    },
  },

  title1: {
    color: '$pe_color_gray_2',
  },

  title1_compact: {
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
  },

  title2_compact: {
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
  showOnSmallScreens: boolean;
};