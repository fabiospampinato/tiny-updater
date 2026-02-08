
/* IMPORT */

import colors from 'tiny-colors';
import whenExit from 'when-exit';
import {isObject, isString} from './utils';
import type {Package} from './types';

/* MAIN */

const compare = ( versionA: string, versionB: string ): -1 | 0 | 1 => {

  /* BASIC PARSING */

  const [baseA, suffixA = ''] = versionA.split ( '+' )[0].split ( '-' );
  const [baseB, suffixB = ''] = versionB.split ( '+' )[0].split ( '-' );

  /* BASE COMPARISON */

  const basePartsA = baseA.split ( '.' );
  const basePartsB = baseB.split ( '.' );

  for ( let i = 0; i < 3; i++ ) {

    let a = Number ( basePartsA[i] ) || 0;
    let b = Number ( basePartsB[i] ) || 0;

    if ( a > b ) return 1;
    if ( b > a ) return -1;

  }

  /* SUFFIX COMPARISON */

  if ( suffixA && !suffixB ) return -1;
  if ( suffixB && !suffixA ) return 1;

  const suffixPartsA = suffixA.split ( '.' );
  const suffixPartsB = suffixB.split ( '.' );

  for ( let i = 0, l = Math.max ( suffixPartsA.length, suffixPartsB.length ); i < l; i++ ) {

    const a = Number ( suffixPartsA[i] ) || suffixPartsA[i] || '';
    const b = Number ( suffixPartsB[i] ) || suffixPartsB[i] || '';

    if ( a > b ) return 1;
    if ( b > a ) return -1;

  }

  /* FALLBACK */

  return 0;

};

const getLatest = async ( name: string ): Promise<string | undefined> => {

  const url = `https://registry.npmjs.org/${name}/latest`;
  const headers = new Headers ({ 'Accept': 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*' });
  const response = await fetch ( url, { headers } );
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
