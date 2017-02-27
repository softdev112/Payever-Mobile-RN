import { Navigation } from 'react-native-navigation';
import { TouchableWithoutFeedback } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

export default function PushNotification(
  { action, message }: { action: () => void; message: string }
) {
  function runNotificationAction() {
    Navigation.dismissInAppNotification();

    action();
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={runNotificationAction}>
        <View style={styles.notifContent}>
          <View style={styles.iconContainer}>
            <Icon style={styles.icon} source="icon-payever-64" />
          </View>
          <Text style={styles.message}>{message}</Text>
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

  iconContainer: {
    width: 25,
    height: 25,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  icon: {
    fontSize: 16,
    color: '#000',
  },

  message: {
    color: '#FFF',
    fontSize: 16,
  },
});