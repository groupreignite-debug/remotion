#!/usr/bin/env bash
# Prepares the passing-site footage from the original screen recording:
#  - keeps 1.1s–7.0s (hero section only; skips the iOS control centre at the start)
#  - crops off the iOS status bar (top 135px) and the Safari URL bar -> 880x1585
#  - blurs real brand names (logo, "...running on Stripe" ticker, customer logos).
#    Boxes cover both scroll positions (the page shifts up 37px around 3.5s).
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=source-media/site-02-original.mp4
BASE="trim=start=1.1:end=7.0,setpts=PTS-STARTPTS,crop=880:1585:0:135"
ffmpeg -v error -y -i "$SRC" -an -vf "$BASE" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p public/site-02-hero-unblurred.mp4
ffmpeg -v error -y -i "$SRC" -an -filter_complex "
[0:v]$BASE,split=4[b][c1][c2][c3];
[c1]crop=200:140:14:0,gblur=sigma=28[l];
[c2]crop=600:118:14:258,gblur=sigma=20[g];
[c3]crop=880:180:0:918,gblur=sigma=18[r];
[b][l]overlay=14:0[o1];[o1][g]overlay=14:258[o2];[o2][r]overlay=0:918" \
  -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p public/site-02-hero.mp4
