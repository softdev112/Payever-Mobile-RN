import type { ModuleRegistry } from '../index';

import Login from './screens/Login';
import auth from './reducers/auth';
import AuthApi from '../../common/api/AuthApi';

export default function register(registry: ModuleRegistry) {
  registry
    .registerScreen('auth.Login', Login)
    .registerReducer('auth', auth)
}