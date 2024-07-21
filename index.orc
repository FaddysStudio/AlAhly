
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
