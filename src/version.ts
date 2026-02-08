
/* IMPORT */

import colors from 'tiny-colors';
import whenExit from 'when-exit';
import {isObject, isString} from './utils';
import type {Package} from './types';

/* MAIN */

const compare = ( a: string, b: string ): -1 | 0 | 1 => { // This is just a slightly modified version of semver-compare, MIT licensed

  const pa = a.split ( '.' );
  const pb = b.split ( '.' );

  for ( let i = 0; i < 3; i++ ) {

    let na = Number ( pa[i] );
    let nb = Number ( pb[i] );

    if ( na > nb ) return 1;
    if ( nb > na ) return -1;
    if ( !isNaN ( na ) && isNaN ( nb ) ) return 1;
    if ( isNaN ( na ) && !isNaN ( nb ) ) return -1;

  }

  return 0;

};

const getLatest = async ( name: string ): Promise<string | undefined> => {

  const url = `https://registry.npmjs.org/${name}/latest`;
  const response = await fetch ( url );
  const json: Package = await response.json ();

  if ( !isObject ( json ) ) return;
  if ( !isString ( json.version ) ) return;

  return json.version;

};

const notify = ( name: string, version: string, latest: string ): void => {

  if ( !globalThis.process?.stdout?.isTTY ) return; // Probably piping stdout

  const log = () => console.log ( `\n\n📦 Update available for ${colors.cyan ( name )}: ${colors.gray ( version )} → ${colors.green ( latest )}` );

  whenExit ( log );

};

/* EXPORT */

export {compare, getLatest, notify};
