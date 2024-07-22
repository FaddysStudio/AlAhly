#!/usr/bin/env roll

# Al Ahly

Song by Faddy Michel

In Solidarity with The People of Palestine till Their Whole Land is FREE

## Installation

Since this file is a roll, it requires Faddy's Roll to be installed.
In addition, Csound must be installed for this roll to work.

```sh
sudo npm i -g @faddys/roll
```

## Usage

```sh
./README.md
```

## Music Production

### `NOTATION`

```roll
?# cat - > NOTATION
```

```
+==

~ 120 4

0/4 clap/1 1/4 clap/2 2/4 clap/3 3/4 clap/4 | $ maqsum 0/8 dom/01 1/8 tak/04 3/8 tak/07 4/8 dom/12 6/8 tak/06

| maqsum

-==
```

### `$FaddysStudio`

```roll
?+ FaddysStudio /home/faddymichel/FaddysStudio
```

### `equipment/`

```roll
?# rm -fr equipment ; mkdir equipment
```

#### `equipment/dom`

```roll
?# cd equipment ; ln -s $FaddysStudio/Dom/audio dom
```

#### `equipment/tak`

```roll
?# cd equipment ; ln -s $FaddysStudio/Tak/audio tak
```

#### `equipment/sak`

```roll
?# cd equipment ; ln -s $FaddysStudio/Sak/audio sak
```

#### `equipment/clap`

```roll
?# cd equipment ; ln -s $FaddysStudio/Dirt-Samples/realclaps clap
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

SNote strget p4
p3 filelen SNote

aLeft, aRight diskin2 SNote

outs aLeft/p5, aRight/p6

endin

instr 2, loop

rewindscore

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

//-==
```

```roll
?# node index.mjs NOTATION > index.sco
```

```roll
?# -1 csound -odac index.orc index.sco
```
