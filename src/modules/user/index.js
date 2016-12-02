import type { ModuleRegistry } from '../index';

import UserApi from './api/UserApi';
import businesses from './reducers/businesses';
import user from './reducers/user';

export default function register(registry: ModuleRegistry) {
  registry
    .registerApi('user', UserApi)
    .registerReducer('businesses', businesses)
    .registerReducer('user', user);
}