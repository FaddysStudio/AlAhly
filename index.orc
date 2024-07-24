
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
