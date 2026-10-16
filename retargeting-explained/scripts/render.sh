#!/usr/bin/env bash
# Render the reel and the cover, then master the audio for Instagram (-14 LUFS integrated, true peak < -1 dBFS).
# The mastering pass is the reference build's: a fixed gain into a limiter, video stream copied untouched.
# Re-measure with ebur128 (printed at the end) if the mix changes. GAIN=2.0 dB puts this mix at -14.0 LUFS.
# Optional: BROWSER=/path/to/chrome-headless-shell to use a local browser instead of Remotion's download.
set -euo pipefail
cd "$(dirname "$0")/.."
GAIN=2.0
B=()
if [ -n "${BROWSER:-}" ]; then B=(--browser-executable="$BROWSER"); fi
mkdir -p out renders
npx remotion render RetargetingExplained out/retargeting-explained-raw.mp4 --codec=h264 "${B[@]}"
ffmpeg -v error -y -i out/retargeting-explained-raw.mp4 -c:v copy \
	-af "volume=${GAIN}dB,alimiter=limit=0.85:attack=3:release=60:level=false,aresample=48000" \
	-c:a aac -b:a 256k -movflags +faststart renders/retargeting-explained.mp4
npx remotion still RetargetingCover cover.png "${B[@]}"
ffmpeg -i renders/retargeting-explained.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A15 Summary | grep -E "I:|Peak:"
