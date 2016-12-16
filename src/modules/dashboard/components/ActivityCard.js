import type ActivityItem from '../../../store/UserProfilesStore/ActivityItem';

import { Component } from 'react';
import { Image, Link, StyleSheet, Text, View } from 'ui';

export default class ActivityCards extends Component {
  props: {
    navigator: Navigator,
    activity: ActivityItem
  };

  onLinkPress() {
    const { navigator, activity } = this.props;
    navigator.push({
      title: activity.title,
      screen: 'core.WebView',
      passProps: { url: activity.activityUrl },
    });
  }

  render() {
    const { activity } = this.props;

    return (
      <View style={styles.container} >
        <Image style={styles.icon} source={activity.iconSource} />
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.description}>{activity.plainDescription}</Text>
        <Image style={styles.image} resizeMode="contain" source={activity.imageSource} />
        <Link style={styles.link} onPress={::this.onLinkPress}>
          {activity.url_label}
        </Link>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 27,
    paddingTop: 25,
    paddingBottom: 15,
    margin: 10,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowRadius: 7,
    shadowOffset: {
      width: -3,
      height: 7,
    },
    shadowOpacity: 1,
    elevation: 4,
    borderRadius: 8,
    width: '80%',
  },

  icon: {
    marginBottom: 12,
    width: 34,
    height: 34
  },

  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '$pe_color_dark_gray'
  },

  description: {
    marginBottom: 10,
    color: '$pe_color_gray_2'
  },

  image: {
    height: 196,
    marginBottom: 10
  },

  link: {
    position: "absolute",
    bottom: 15,
    left: 27
  }
});