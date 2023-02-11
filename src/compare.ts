/**
 * This software is released under the MIT license:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* MAIN */

// The following is just a slightly modified version of semver-compare

const compare = ( a: string, b: string ): -1 | 0 | 1 => {

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

/* EXPORT */

export default compare;
