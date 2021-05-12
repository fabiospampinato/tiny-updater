
/* IMPORT */

import Aborter from 'aborter';
import {cyan, gray, green} from 'colorette';
import fetch from 'node-fetch';
import compare from 'semver-compare';
import onExit from 'signal-exit';

/* MAIN */

const Utils = {

  /* API */

  getExitSignal: () => {
    const aborter = new Aborter ();
    onExit ( () => aborter.abort () );
    return aborter.signal as any; //TSC: Not techincally 100% compliant with AbortSignal, but good enough for node-fetch
  },

  getLatestVersion: async ( name: string ): Promise<string | undefined> => {
    const latestUrl = `http://registry.npmjs.org/${name}/latest`;
    const signal = Utils.getExitSignal ();
    const response = await fetch ( latestUrl, {signal} );
    const latest = await response.json ();
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
