import type { ModuleRegistry } from '../index';

import Dashboard from './screens/Dashboard';

export default function register(registry: ModuleRegistry) {
  registry
    .registerScreen('dashboard.Dashboard', Dashboard);
}