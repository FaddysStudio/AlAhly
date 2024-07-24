#!/usr/bin/env roll

# Music Producer

Work of Faddy Michel

In Solidarity with The People of Palestine till Their Whole Land is FREE

## Prerequisites

Since this file is a roll, it requires Faddy's Roll to be installed;
which in turn requires Node.js and NPM to be installed.

```sh
# After installing node and npm:
sudo npm i -g @faddys/roll
# Now, the roll command is available.
```

In addition, Csound must be installed for this roll to work.

## Usage

```sh
./PRODUCER.md NOTATION
```

## Example

### `example.no`

```roll
?# cat - > example.no
```

```
+==

~ 105 4

o testRecording

$ countdown 0/4 clap/1 1/4 clap/2 2/4 clap/3 3/4 clap/4

| $ maqsum 0/8 dom/01 1/8 tak/04 3/8 tak/07 4/8 dom/12 6/8 tak/06

| 0/4 sak/00 1/4 sak/08 2/4 sak/16 3/4 sak/23

-==
```

## Implementation

### `index.orc`

```roll
?# cat - > index.orc
```

```csound
//+==

sr = 48000
ksmps = 32
nchnls = 2
0dbfs = 1

instr 1, beat

iRate init 1 / abs ( p3 )
p3 *= 1000
SNote strget p4
strset p5, SNote

kLoop metro iRate

if kLoop == 1 then

schedulek 13 + frac ( p1 ), 0, 1, p5, p6, p7

endif

endin

instr 13, playback

SNote strget p4
p3 filelen SNote

aLeft, aRight diskin2 SNote

outs aLeft / ( p5 + 1 ), aRight / ( p6 + 1 )

endin

instr 2, loop

setscorepos p3

endin

instr 3, record

/*
iInstance chnget "record"
chnset iInstance + 1, "record"

SPath strget p4
SRecord sprintf "%s_%d.wav", SPath, iInstance
*/

SRecord strget p4

aLeft, aRight ins

fout SRecord, -1, aLeft, aRight

endin

//-==
```

### `@faddys/scenarist`

```roll
?# if [ ! -d node_modules/@faddys/scenarist ] ; then npm i @faddys/scenarist ; fi
```

### `index.mjs`

```roll
?# cat - > index.mjs
```

```js
//+==

import Scenarist from '@faddys/scenarist';
import { readFile } from 'node:fs/promises';

await Scenarist ( new class extends Array {

async $_producer ( $ ) {

try {

const notation = await readFile ( process .argv .slice ( 2 ) .shift () || 'example.no', 'utf8' );

for ( let line of notation .trim () .split ( '\n' ) )
if ( ( line = line .trim () ) .length )
await $ ( ... line .split ( /\s+/ ) );

await $ ( '|' );

console .log ( this .map ( note => ( typeof note === 'object' ? this .note ( note ) : note ) ) .join ( '\n' ) );

} catch ( error ) {

console .error ( '#error', error ?.message || error );

}

}

[ '$~' ] ( $, tempo, bar, ... argv ) {

this .push ( `v ${ bar }` );

Object .assign ( this, { tempo, bar } );

return $ ( ... argv );

}

time = 0;

[ '$|' ] ( $, ... argv ) {

this .time++;

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
this [ '$' + label ] = ( $, ... argv ) => {

this .push ( ... this [ label ] );

return $ ( ... argv );

};

return $ ( ... argv );

}

left = 3;
right =3;

[ '$=' ] ( $, left, right, ... argv ) {

Object .assign ( this, { left, right } );

return $ ( ... argv );

}

#instance = 0
instance () { return ++this .#instance % 10 === 0 ? ++this .#instance : this .#instance }

$_director ( $, ... argv ) {

if ( ! argv .length )
return this .label;

const [ step, divisions ] = argv .shift () .split ( '/' );
const sound = argv .shift ();
const { time } = this;
const note = { step, divisions, sound, time };

this .push ( note );

if ( this .label ?.length )
this [ this .label ] .push ( note );

return $ ( ... argv );

}

note ( { step, divisions, sound, time } ) {

const instance = this .instance ();

return [

'i',
`1.${ instance }`,
`[${ step }/${ divisions }]`,
time === this .time - 1 ? this .time : -this .time,
`"equipment/${ sound }.wav"`,
instance,
this .left,
this .right

] .join ( ' ' );

}

record = {}

 $o ( $, path ) {

this .push ( `i 3.${ this .record [ path ] = this .instance () } 0 -1 "${ path }"` );

}

} );

//-==
```

```roll
?# $ node index.mjs > index.sco
```

```roll
?# -1 csound -iadc -odac index.orc index.sco
```
