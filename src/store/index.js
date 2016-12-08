import { observable } from 'mobx';

export default {
  auth: require('./authStore').default,
  loader: observable({ isLoading: false })
};