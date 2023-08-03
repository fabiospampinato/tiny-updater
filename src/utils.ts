
/* IMPORT */

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
    const latestUrl = `https://registry.npmjs.org/${name}/latest`;
    const latest = await Utils.fetch ( latestUrl );
    return latest.version;
  },

  isNumber: ( value: unknown ): value is number => {
    return typeof value === 'number';
  },

  isString: ( value: unknown ): value is string => {
    return typeof value === 'string';
  },

  isUpdateAvailable: ( current: string, latest: string ): boolean => {
    return compare ( current, latest ) === -1;
  },

  noop: (): undefined => {
    return;
  },

  notify: ( name: string, version: string, latest: string ): void => {
    if ( !globalThis.process?.stdout?.isTTY ) return; // Probably piping stdout
    const log = () => console.log ( `\n\n📦 Update available for ${colors.cyan ( name )}: ${colors.gray ( version )} → ${colors.green ( latest )}` );
    whenExit ( log );
  }

};

/* EXPORT */

export default Utils;
