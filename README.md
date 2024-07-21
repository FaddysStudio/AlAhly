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

outs aLeft/p5, aRight/p5

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

//-==
```

```roll
?# node index.mjs drum.notation
```
