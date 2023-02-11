
/* IMPORT */

import Utils from './utils';
import type {Options} from './types';

/* MAIN */

//TODO: Check for updates less often
//TODO: Annoy the user less
//TODO: Account for non-latest releases
//TODO: Don't output anything if the output is being piped somewhere

const updater = async ( { name, version }: Options ): Promise<boolean> => {

  const latest = await Utils.getLatestVersion ( name ).catch ( () => undefined );

  if ( !latest ) return false;

  if ( !Utils.isUpdateAvailable ( version, latest ) ) return false;

  Utils.notify ( name, version, latest );

  return true;

};

/* EXPORT */

export default updater;
