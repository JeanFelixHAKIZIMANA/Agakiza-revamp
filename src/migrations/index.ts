import * as migration_20261031_193731_initial from './20261031_193731_initial';

export const migrations = [
  {
    up: migration_20261031_193731_initial.up,
    down: migration_20261031_193731_initial.down,
    name: '20261031_193731_initial'
  },
];
