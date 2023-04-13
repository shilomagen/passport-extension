import merge from 'lodash.merge';
import { DeepPartial } from 'ts-essentials';

export type Overridable<T> = (overrides?: DeepPartial<T>) => T;

export const overridable =
  <T>(defaults: () => T): Overridable<T> =>
  (overrides: DeepPartial<T> = {} as DeepPartial<T>): T =>
    merge(defaults(), overrides);
