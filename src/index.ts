
/* IMPORT */

import Store from './store';
import Utils from './utils';
import type {Options, StoreRecord} from './types';

/* MAIN */

//TODO: Account for non-latest releases

/**
 * Checks and informs the user if there is an update available for the given package.
 *
 * @example
 *
 * The simplest way to use the library requires passing the `name` and `version` of
 * your package. This will check and inform the user if there is an update available
 * ever time it runs.
 *
 * ```js
 * import {name, version} from './package.json';
 * import updater from 'tiny-updater';
 *
 * await updater ({ name, version });
 * ```
 *
 * @example
 *
 * You can optionally improve the user experience by providing a `ttl` (time-to-live)
 * cache duration in milliseconds. This prevents the same update notification from
 * being shown repeatedly by only checking for updates after the specified time has passed.
 * This also improves performance by avoiding unnecessary HTTP requests to the npm registry.
 *
 * For example, with `ttl: 86_400_000` (24 hours), users will only see update notifications
 * once per day, even if your application runs multiple times.

 *
 * ```js
 * import {name, version} from './package.json';
 * import updater from 'tiny-updater';
 *
 * await updater ({ name, version, ttl: 86_400_000 });
 * ```
 *
 * @returns `true` if an update is available, `false` otherwise.
 */
const updater = async ( { name, version, ttl = 0 }: Options ): Promise<boolean> => {

  const record = Store.get ( name );
  const timestamp = Date.now ();
  const isFresh = !record || ( timestamp - record.timestampFetch ) >= ttl;
  const latest = isFresh ? await Utils.getLatestVersion ( name ).catch ( Utils.noop ) : record?.version;

  if ( !latest ) return false;

  if ( isFresh ) {

    const record: StoreRecord = { timestampFetch: timestamp, timestampNotification: timestamp, version: latest };

    Store.set ( name, record );

  }

  if ( !Utils.isUpdateAvailable ( version, latest ) ) {

    return false;

  }

  if ( isFresh ) {

    Utils.notify ( name, version, latest );

  }

  return true;

};

/* EXPORT */

export default updater;
export type {Options};
