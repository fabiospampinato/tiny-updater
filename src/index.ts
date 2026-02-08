
/* IMPORT */

import * as Store from './store';
import {noop} from './utils';
import {compare, getLatest, notify} from './version';
import type {Options, StoreRecord} from './types';

/* MAIN */

//TODO: Account for non-latest releases

const updater = async ( { name, version, ttl = 0 }: Options ): Promise<boolean> => {

  const record = Store.get ( name );
  const timestamp = Date.now ();
  const isFresh = !record || ( timestamp - record.timestamp ) >= ttl;
  const latest = isFresh ? await getLatest ( name ).catch ( noop ) : record?.version;

  if ( !latest ) return false;

  if ( isFresh ) {

    const record: StoreRecord = { timestamp, version: latest };

    Store.set ( name, record );

  }

  if ( compare ( version, latest ) >= 0 ) { // Current version is not older

    return false;

  }

  if ( isFresh ) {

    notify ( name, version, latest );

  }

  return true;

};

/* EXPORT */

export default updater;
export type {Options};
