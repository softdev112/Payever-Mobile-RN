import type { ModuleRegistry } from '../index';

import Login from './screens/Login';

export default function register(registry: ModuleRegistry) {
  registry
    .registerScreen('auth.Login', Login)
}