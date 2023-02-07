
/* IMPORT */

import Utils from './utils';

/* MAIN */

//TODO: Provide command suggestion for updating
//TODO: Check if using yarn
//TODO: Check if installed globally
//TODO: Check if installed as a dev dependency
//TODO: Check if installed as peer dependency
//TODO: Check for updates less often
//TODO: Annoy the user less
//TODO: Account for non-latest releases
//TODO: Don't output anything if the output is being piped somewhere

const updater = async ({ name, version }: { name: string, version: string }): Promise<boolean> => {

  const latest = await Utils.getLatestVersion ( name ).catch ( () => undefined );

  if ( !latest ) return false;

  if ( !Utils.isUpdateAvailable ( version, latest ) ) return false;

  Utils.notify ( name, version, latest );

  return true;

};

/* EXPORT */

export default updater;
