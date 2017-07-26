import { Navigation } from 'react-native-navigation';
import { TouchableWithoutFeedback } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

export default function PushNotification(
  { action, message, style, textStyle }: NotifPropTypes
) {
  function runNotificationAction() {
    Navigation.dismissInAppNotification();

    if (action) {
      action();
    }
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={runNotificationAction}>
        <View style={styles.notifContent}>
          <Icon style={styles.icon} source="icon-payever-64" />
          <Text style={[styles.message, textStyle]}>{message}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'yellowgreen',
  },

  notifContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 16,
    color: '#000',
  },

  message: {
    marginLeft: 10,
    color: '#FFF',
    fontSize: 16,
  },
});

type NotifPropTypes = {
  action?: () => void;
  message?: string;
  style?: Object;
  textStyle?: Object;
};