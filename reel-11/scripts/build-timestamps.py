"""Groups the ElevenLabs Scribe word list into the 14 script lines and writes vo/timestamps.json.

Usage: python3 scripts/build-timestamps.py <words-raw.json>
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_LINES = (ROOT / "vo" / "script.txt").read_text(encoding="utf-8").strip().split("\n")

raw = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
words = [w for w in raw["words"] if w["type"] == "word"]

lines = []
cursor = 0
for i, line in enumerate(SCRIPT_LINES):
    tokens = line.split()
    chunk = words[cursor : cursor + len(tokens)]
    cursor += len(tokens)
    for token, w in zip(tokens, chunk):
        if token != w["text"]:
            raise SystemExit(f"Line {i + 1}: script word {token!r} != transcript word {w['text']!r}")
    lines.append(
        {
            "line": i + 1,
            "text": line,
            "start": chunk[0]["start"],
            "end": chunk[-1]["end"],
            "words": [{"text": w["text"], "start": w["start"], "end": w["end"]} for w in chunk],
        }
    )

if cursor != len(words):
    raise SystemExit(f"Transcript has {len(words) - cursor} extra words")

out = {
    "source": "vo/voiceover.mp3",
    "voice": "Rami - Friendly and Easygoing (Ughw9ouHSYmmbRa0am9u), eleven_multilingual_v2",
    "alignment": "ElevenLabs Scribe v1 word timings on the approved master take",
    "lines": lines,
}
(ROOT / "vo" / "timestamps.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"Wrote {len(lines)} lines, {cursor} words")
