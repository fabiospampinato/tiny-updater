
/* IMPORT */

import once from 'function-once';
import IonStore from 'ionstore';
import {isNumber, isObject, isString} from './utils';
import type {Record} from './types';

/* MAIN */

const store = once ((): IonStore => {

  return new IonStore ( 'tiny-updater' );

});

const get = ( name: string ): Record | undefined => {

  try {

    const recordRaw = store ().get ( name );

    if ( !recordRaw ) return;

    const record: Record = JSON.parse ( recordRaw );

    if ( !isObject ( record ) ) return;
    if ( !isNumber ( record.timestamp ) ) return;
    if ( !isString ( record.version ) ) return;

    return record;

  } catch {}

};

const set = ( name: string, record: Record ): undefined => {

  store ().set ( name, JSON.stringify ( record ) );

};

/* EXPORT */

export {get, set};
