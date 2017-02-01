import { StyleSheet, View } from 'ui';

export default function OnlineStatus({ isOnline, size, style }: PropTypes) {
  const statusStyles = [styles.container, style];
  if (isOnline) {
    statusStyles.push(styles.onlineStatus);
  } else {
    statusStyles.push(styles.offlineStatus);
  }

  if (size !== undefined) {
    statusStyles.push({
      height: size,
      width: size,
      borderRadius: size / 2,
    });
  }

  return (
    <View style={statusStyles} />
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: '#d8d8d8',
    borderRadius: 4,
    borderWidth: 1,
    height: 8,
    width: 8,
  },

  offlineStatus: {
    backgroundColor: '#FFF',
    borderWidth: 1,
  },

  onlineStatus: {
    backgroundColor: '#75b636',
    borderWidth: 0,
  },
});

type PropTypes = {
  online: boolean;
};