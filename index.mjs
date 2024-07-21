
import Scenarist from '@faddys/scenarist';
import { readFile } from 'node:fs/promises';

await Scenarist ( new class extends Array {

async $_producer ( $ ) {

try {

const notation = await readFile ( process .argv .slice ( 2 ) .shift (), 'utf8' );

console .log ( notation );

for ( let line of notation .trim () .split ( '\n' ) )
if ( ( line = line .trim () ) .length )
await $ ( ... line .split ( /\s+/ ) );

} catch ( error ) {

console .error ( '#error', error ?.message || error );

}

}

[ '$|' ] ( $, tempo, length ) {

if ( this .length )
this .push ( 's' );

this .push ( `t 0 ${ tempo }`, `v ${ length }` );

}

instance = 0

$_director ( $, ... argv ) {

if ( ! argv .length )
return delete this .distance;

if ( ! this .distance )
this .distance = argv .shift .split ( ':' );

const [ step, divisions ] = argv .shift () .split ( '/' );
const sound = argv .shift ();
const [ left, right ] = this .distance;

this .push ( [

'i',
`1.${ ++this .instance % 10 === 0 ? ++this .instance : this .instance }`,
`[${ step }/${ divisions }]`,
'0',
`"equipment/${ sound }.wav"`,
left, right

] .join ( ' ' ) );

return $ ( ... argv );

}

} );
