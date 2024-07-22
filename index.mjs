
import Scenarist from '@faddys/scenarist';
import { readFile } from 'node:fs/promises';

await Scenarist ( new class extends Array {

async $_producer ( $ ) {

try {

const notation = await readFile ( process .argv .slice ( 2 ) .shift (), 'utf8' );

for ( let line of notation .trim () .split ( '\n' ) )
if ( ( line = line .trim () ) .length )
await $ ( ... line .split ( /\s+/ ) );

await $ ( '|' );

console .log ( this .join ( '\n' ) );

} catch ( error ) {

console .error ( '#error', error ?.message || error );

}

}

[ '$~' ] ( $, tempo, bar, ... argv ) {

this .push ( `v ${ bar }` );

Object .assign ( this, { tempo, bar } );

return $ ( ... argv );

}

[ '$|' ] ( $, ... argv ) {

this .push (

`t 0 ${ this .tempo }`,
'v 1',
`s ${ this .bar }`

);

return $ ( '~', this .tempo, this .bar, ... argv );

}

$$ ( $, label, ... argv ) {

this .label = label;
this [ label ] = [];
this [ '$' + label ] = () => this .push ( ... this [ label ] .map ( note => this .note ( note ) ) );

return $ ( ... argv );

}

left = 1;
right = 1;

[ '$=' ] ( $, left, right, ... argv ) {

Object .assign ( this, { left, right } );

return $ ( ... argv );

}

instance = 0
distance = []

$_director ( $, ... argv ) {

if ( ! argv .length )
return this .label;

const [ step, divisions ] = argv .shift () .split ( '/' );
const sound = argv .shift ();
const note = { step, divisions, sound };

this .note ( note );

if ( this .label ?.length )
this [ this .label ] .push ( note );

return $ ( ... argv );

}

note ( { step, divisions, sound } ) {

this .push ( [

'i',
`1.${ ++this .instance % 10 === 0 ? ++this .instance : this .instance }`,
`[${ step }/${ divisions }]`,
'1',
`"equipment/${ sound }.wav"`,
this .left,
this .right

] .join ( ' ' ) );

}

} );
