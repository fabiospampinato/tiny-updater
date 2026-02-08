
/* IMPORT */

import * as Store from './store';
import {noop} from './utils';
import {compare, getLatest, notify} from './version';
import type {Options, Registry, Result, StoreRecord} from './types';

/* MAIN */

//TODO: Support updating to non-latest releases

const updater = async ( { name, version, print, registry, ttl = 0 }: Options ): Promise<boolean> => {

  const record = Store.get ( name );
  const timestamp = Date.now ();
  const isFresh = !record || ( timestamp - record.timestamp ) >= ttl;
  const latest = isFresh ? await getLatest ( name, registry ).catch ( noop ) : record?.version;

  if ( !latest ) return false;

  if ( isFresh ) {

    const record: StoreRecord = { timestamp, version: latest };

    Store.set ( name, record );

  }

  if ( compare ( version, latest ) >= 0 ) { // Current version is not older

    return false;

  }

  if ( isFresh ) {

    const result: Result = { name, current: version, latest };

    notify ( result, print );

  }

  return true;

};

/* EXPORT */

export default updater;
export type {Options, Registry, Result};
