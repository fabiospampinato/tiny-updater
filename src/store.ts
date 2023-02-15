
/* IMPORT */

import {SessionStore} from 'isostore';
import Utils from './utils';
import type {StoreRecord} from './types';

/* MAIN */

class Store {

  /* VARIABLES */

  private store = new SessionStore ( 'tiny-updater' );

  /* API */

  get = ( name: string ): StoreRecord | undefined => {

    try {

      const recordRaw = this.store.get ( name );

      if ( !recordRaw ) return;

      const record = JSON.parse ( recordRaw );

      if ( !Utils.isNumber ( record.timestampFetch ) ) return;
      if ( !Utils.isNumber ( record.timestampNotification ) ) return;
      if ( !Utils.isString ( record.version ) ) return;

      return record;

    } catch {

      return;

    }

  }

  set = ( name: string, record: StoreRecord ): void => {

    this.store.set ( name, JSON.stringify ( record ) );

  }

}

/* EXPORT */

export default new Store ();
