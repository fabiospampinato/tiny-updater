
/* IMPORT */

import {describe} from 'fava';
import updater from '../dist/index.js';

/* MAIN */

describe ( 'TinyUpdater', it => {

  it ( 'works', async t => {

    const yes = await updater ({ name: 'aborter', version: '0.0.0' });

    t.true ( yes );

    const no = await updater ({ name: 'aborter', version: '100.0.0' });

    t.false ( no );

    //TODO: The following shouldn't produce any stdout output, check for that automatically somehow

    const yes2 = await updater ({ name: 'aborter', version: '0.0.0', ttl: 86_400_000 });

    t.true ( yes2 );

    const no2 = await updater ({ name: 'aborter', version: '100.0.0', ttl: 86_400_000 });

    t.false ( no2 );

  });

});
