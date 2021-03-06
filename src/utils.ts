
/* IMPORT */

import fetch from 'fetch-shim';
import colors from 'tiny-colors';
import whenExit from 'when-exit';
import compare from './compare';

/* MAIN */

const Utils = {

  /* API */

  fetch: async ( url: string ): Promise<{ version?: string }> => {
    const signal = Utils.getExitSignal ();
    const request = await fetch ( url, { signal } );
    const json = await request.json ();
    return json;
  },

  getExitSignal: () => {
    const aborter = new AbortController ();
    whenExit ( () => aborter.abort () );
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
    const log = () => console.log ( `\n\nš¦ Update available for ${colors.cyan ( name )}: ${colors.gray ( version )} ā ${colors.green ( latest )}` );
    whenExit ( log );
  }

};

/* EXPORT */

export default Utils;
