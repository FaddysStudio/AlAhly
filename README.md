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
?# cp -r $FaddysStudio/Dom/audio equipment/dom
```

#### `equipment/tak`

```roll
?# cp -r $FaddysStudio/Tak/audio equipment/tak
```

#### `equipment/sak`

```roll
?# cp -r $FaddysStudio/Sak/audio equipment/sak
```

#### `equipment/clap`

```roll
?# cp -r $FaddysStudio/Dirt-Samples/realclaps equipment/clap
```
