
/* IMPORT */

const updater = require ( '../dist' );

/* MAIN */

const test = async () => {

  const yes = await updater ({ name: 'aborter', version: '0.0.0' });

  console.assert ( yes );

  const no = await updater ({ name: 'aborter', version: '100.0.0' });

  console.assert ( !no );

};

test ();
