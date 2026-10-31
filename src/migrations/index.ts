import * as migration_20261031_193731_initial from './20261031_193731_initial';
import * as migration_20261031_201105_daily_verse from './20261031_201105_daily_verse';

export const migrations = [
  {
    up: migration_20261031_193731_initial.up,
    down: migration_20261031_193731_initial.down,
    name: '20261031_193731_initial',
  },
  {
    up: migration_20261031_201105_daily_verse.up,
    down: migration_20261031_201105_daily_verse.down,
    name: '20261031_201105_daily_verse'
  },
];
