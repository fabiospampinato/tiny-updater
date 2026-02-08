
/* IMPORT */

import {describe} from 'fava';
import updater from '../dist/index.js';
import {compare} from '../dist/version.js';

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

describe ( 'compare', it => {

  it ( 'works', async t => {

    const TESTS = [
      // major
      ['1.0.0', '2.0.0', -1],
      ['1.0.0', '1.0.0', 0],
      ['2.0.0', '1.0.0', 1],
      // minor
      ['1.0.0', '1.1.0', -1],
      ['1.0.0', '1.0.0', 0],
      ['1.1.0', '1.0.0', 1],
      // patch
      ['1.0.0', '1.0.1', -1],
      ['1.0.0', '1.0.0', 0],
      ['1.0.1', '1.0.0', 1],
      // hierarchy
      ['2.0.0', '1.0.1', 1],
      ['1.2.0', '1.0.1', 1],
      ['1.0.1', '2.0.0', -1],
      ['1.0.1', '1.2.0', -1],
      // partial
      ['1', '2', -1],
      ['1.0', '2.0', -1],
      ['1.0.0', '2.0', -1],
      ['1.0.0', '2', -1],
      ['1.0.0', '1.1', -1],
      ['1.2', '1.2.0', 0],
      ['2', '1.9.9', 1],
      ['1.1', '1.1.1', -1],
      // suffixes
      ['1.0.0-alpha', '1.0.0-beta', -1],
      ['1.0.0-beta', '1.0.0-rc', -1],
      ['1.0.0-rc', '1.0.0', -1],
      ['1.0.0-alpha', '1.0.0-alpha.1', -1],
      ['1.0.0-alpha.0', '1.0.0-alpha.1', -1],
      ['1.0.0-alpha.1', '1.0.0-alpha.1', 0],
      ['1.0.0-alpha.1', '1.0.0-alpha.2', -1],
      ['1.0.0-beta.10', '1.0.0-beta.2', 1],
      // builds
      ['1', '1+2', 0],
      ['1', '2+2', -1],
      ['2', '1+2', 1],
      ['1+2', '1', 0],
      ['1+2', '2', -1],
      ['2+2', '1', 1],
      ['1+2', '1+2', 0],
      ['1+2', '2+2', -1],
      ['2+2', '1+2', 1]
    ];

    for ( const [a, b, expected] of TESTS ) {

      t.is ( compare ( a, b ), expected );

    }

  });

});
