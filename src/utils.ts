
/* IMPORT */

import colors from 'tiny-colors';
import whenExit from 'when-exit';
import compare from './compare';
import type {UtilsFetchOptions, UtilsGetLatestVersionOptions} from './types';

/* MAIN */

const Utils = {

  /* API */

  fetch: async (
    url: string,
    options?: UtilsFetchOptions | undefined
  ): Promise<{ version?: string }> => {
    const { authInfo } = { __proto__: null, ...options } as UtilsFetchOptions;
    const headers = new Headers ( {
      'Accept': 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
    } );
    if (authInfo) {
      headers.set( 'Authorization', `${authInfo.type} ${authInfo.token}` );
    }
    const signal = Utils.getExitSignal();
    const request = await fetch( url, { headers, signal } );
    const json = await request.json ();
    return json;
  },

  getExitSignal: () => {
    const aborter = new AbortController ();
    whenExit ( () => aborter.abort () );
    return aborter.signal;
  },

  getLatestVersion: async (
    name: string,
    options?: UtilsGetLatestVersionOptions | undefined
  ): Promise<string | undefined> => {
    const {
      authInfo,
      registryUrl = 'https://registry.npmjs.org/',
    } = { __proto__: null, ...options } as UtilsGetLatestVersionOptions;
    const maybeSlash = registryUrl.endsWith('/') ? '' : '/';
    const latestUrl = `${registryUrl}${maybeSlash}${name}/latest`;
    const json = await Utils.fetch( latestUrl, { authInfo } );
    return json.version;
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
