
/* IMPORT */

import Aborter from 'aborter';
import {cyan, gray, green} from 'colorette';
import get from 'simple-get';
import compare from 'semver-compare';
import onExit from 'signal-exit';

/* MAIN */

const Utils = {

  /* API */

  fetch: ( url: string ): any => {
    return new Promise ( ( resolve, reject ) => {
      const signal = Utils.getExitSignal ();
      const request = get.concat ( url, ( error, response, data ) => {
        if ( error ) return reject ( error );
        return resolve ( JSON.parse ( data.toString () ) );
      });
      signal.addEventListener ( 'abort', request.abort.bind ( request ) );
    });
  },

  getExitSignal: () => {
    const aborter = new Aborter ();
    onExit ( () => aborter.abort () );
    return aborter.signal;
  },

  getLatestVersion: async ( name: string ): Promise<string | undefined> => {
    const latestUrl = `http://registry.npmjs.org/${name}/latest`;
    const latest = await Utils.fetch ( latestUrl );
    return latest.version;
  },

  isUpdateAvailable: ( current: string, latest: string ): boolean => {
    return compare ( current, latest ) === -1;
  },

  notify: ( name: string, version: string, latest: string ): void => {
    const log = () => console.log ( `\n\n📦 Update available for ${cyan ( name )}: ${gray ( version )} → ${green ( latest )}` );
    onExit ( log, { alwaysLast: true } );
  }

};

/* EXPORT */

export default Utils;
