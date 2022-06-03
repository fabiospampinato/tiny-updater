
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

  });

});
