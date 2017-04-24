import { StyleSheet, Text, View } from 'ui';
import { observer } from 'mobx-react/native';
import Status from './Status';
import type CommunicationStore from '../../../../store/communication';

export default observer(['communication'], (
  { communication }: CommunicationStore
) => {
  const { selectedConversation: conversation } = communication;

  if (!conversation) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.userName} numberOfLines={1}>
        {conversation.name}
      </Text>
      {conversation.status && (
        <Status status={conversation.status} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
  },

  userName: {
    color: '$pe_color_dark_gray',
    fontSize: 22,
    padding: 0,
    fontWeight: '200',
    maxWidth: '60%',
  },
});