#!/usr/bin/env bash
# Synthesises the soft sound-design layer (ticks, whoosh, impact, pen scratch) with ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/../public/sfx"
ff() { ffmpeg -hide_banner -loglevel error -y "$@"; }

# Soft tick: short high sine blip with a fast exponential decay.
ff -f lavfi -i "sine=f=2200:d=0.06" -f lavfi -i "anoisesrc=d=0.06:c=white:a=0.3" \
  -filter_complex "[0][1]amix=2:normalize=0,afade=out:st=0:d=0.05:curve=exp,highpass=f=900,volume=0.9" -ar 44100 tick.wav

# Whoosh: band-passed pink noise swelling in and out.
ff -f lavfi -i "anoisesrc=d=0.55:c=pink:a=0.9" \
  -af "bandpass=f=1400:width_type=o:w=2.2,afade=in:st=0:d=0.3:curve=qsin,afade=out:st=0.3:d=0.25:curve=qsin,volume=1.6" -ar 44100 whoosh.wav

# Low impact hit: 52 Hz body + filtered noise thump.
ff -f lavfi -i "sine=f=52:d=1.1" -f lavfi -i "anoisesrc=d=0.25:c=brown:a=0.9" \
  -filter_complex "[0]afade=out:st=0.02:d=1.05:curve=exp,volume=1.6[a];[1]lowpass=f=420,afade=out:st=0:d=0.22:curve=exp[b];[a][b]amix=2:normalize=0,alimiter=limit=0.9" -ar 44100 impact.wav

# Pen scratch: high-passed noise with a jittery tremolo, 3 s.
ff -f lavfi -i "anoisesrc=d=3:c=white:a=0.6" \
  -af "highpass=f=2500,lowpass=f=7500,tremolo=f=13:d=0.8,tremolo=f=5.3:d=0.5,afade=in:d=0.05,afade=out:st=2.7:d=0.3" -ar 44100 pen.wav
ls -la
