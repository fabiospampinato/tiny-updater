
/* IMPORT */

import Store from './store';
import Utils from './utils';
import type {Options, StoreRecord} from './types';

/* MAIN */

//TODO: Account for non-latest releases

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
