import { AsyncStorage } from 'react-native';

export async function loadSnapshot() {
  try {
    const state = await AsyncStorage.getItem('state');
    if (state !== null){
      return JSON.parse(state);
    } else {
      return {};
    }
  } catch (error) {
    return {};
  }
}

export function snapshotMiddleware() {

}