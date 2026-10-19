"""Word-level alignment of the voiceover to the script.

1. Speech regions are found from the 10ms RMS envelope (-45 dBFS gate).
   Each scripted phrase was matched to its region by transcribing every region
   with Whisper (medium, via sherpa-onnx) - see scripts/transcribe.py.
2. Inside a region, word boundaries are first placed proportionally to the
   word's letter count and then snapped to the quietest 10ms frame nearby.

Output: src/timeline.json (times in seconds of the ORIGINAL voiceover).
"""
import json, re, subprocess, sys
import numpy as np

ROOT = __file__.rsplit('/scripts/', 1)[0]
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{ROOT}/public/voiceover.m4a', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
HOP = 160
n = len(x) // HOP
db = 20 * np.log10(np.sqrt(np.array([np.mean(x[i*HOP:(i+1)*HOP]**2) for i in range(n)])) + 1e-6)
speech = db > -45

regions = []
i = 0
while i < n:
    if speech[i]:
        j = i
        while j < n and speech[j]:
            j += 1
        if regions and i - regions[-1][1] < 30:
            regions[-1][1] = j
        else:
            regions.append([i, j])
        i = j
    else:
        i += 1
regions = [r for r in regions if r[1] - r[0] > 8]

# (line number in script, approx region start in s, phrase as written in the script)
PHRASES = [
    (1, 1.34, 'خلّينا نعمل الـ 5-Second Test على موقعين.'),
    (2, 3.96, 'الفكرة بسيطة:'),
    (2, 5.32, 'بتفتح الموقع،'),
    (2, 6.41, 'بتعدّ لخمسة، وبتسكّرو.'),
    (3, 8.27, 'وبعدين بتسأل حالك خمس أسئلة:'),
    (4, 10.46, 'شو بيعملوا؟'),
    (4, 11.60, 'لمين؟'),
    (4, 12.59, 'ليش هني؟'),
    (4, 13.79, 'شو الخطوة الجاية؟'),
    (4, 15.31, 'فيني إتّكل عليهن؟'),
    (5, 17.16, 'الموقع الأول. عدّ معي.'),
    (6, 20.05, 'شو فهمت؟'),
    (6, 21.11, '"أهلا وسهلا"، صورة حلوة…'),
    (6, 23.08, 'وولا كلمة عن شو بيعملوا.'),
    (7, 25.00, 'ما في زر واضح، والزبون ما بيعرف شو المطلوب منّو.'),
    (8, 28.26, 'هيدا موقع ما نجح بالتجربة.'),
    (9, 30.75, 'الموقع التاني.'),
    (10, 32.81, 'بخمس ثواني'),
    (10, 34.28, 'فهمت شو بيعملوا،'),
    (10, 35.67, 'ولمين،'),
    (10, 36.52, 'والزر قدّامك.'),
    (11, 38.96, 'الفرق مش بالتصميم الحلو.'),
    (11, 40.80, 'الفرق بالوضوح.'),
    (12, 42.26, 'جرّب التجربة على موقعك هلّق.'),
    (12, 44.32, 'إذا ما جاوب على الخمس أسئلة…'),
    (12, 46.25, 'في شغل.'),
    (13, 47.46, 'بدك نعملها لموقعك؟'),
    (13, 48.92, 'اكتب AUDIT بالكومنتات.'),
]

def weight(w):
    core = re.sub(r'[ً-ْـ"،.:؟…,!]', '', w)
    if w in ('5-Second', 'Test', 'AUDIT'):
        return len(core) * 0.7
    return max(len(core), 1) + 1.5

# Manual corrections after inspecting the 20ms envelope (syllable bursts)
OVERRIDES = {
    (1.34, 'الـ'): 1.99, (1.34, '5-Second'): 2.06, (1.34, 'Test'): 2.44, (1.34, 'على'): 2.62, (1.34, 'موقعين.'): 2.84,
    (17.16, 'عدّ'): 18.20, (17.16, 'معي.'): 18.40,
    (48.92, 'AUDIT'): 49.22, (48.92, 'بالكومنتات.'): 49.58,
}

out = []
for line, approx, text in PHRASES:
    a, b = min(regions, key=lambda r: abs(r[0] / 100 - approx))
    words = text.split(' ')
    ws = np.array([weight(w) for w in words])
    cuts = [a] + [int(a + (b - a) * c) for c in np.cumsum(ws)[:-1] / ws.sum()] + [b]
    for k in range(1, len(cuts) - 1):
        lo, hi = max(cuts[k] - 7, cuts[k-1] + 10), min(cuts[k] + 7, cuts[k+1] - 10)
        if hi > lo:
            cuts[k] = lo + int(np.argmin(db[lo:hi]))
    for k, w in enumerate(words):
        if (approx, w) in OVERRIDES:
            cuts[k] = int(round(OVERRIDES[(approx, w)] * 100))
    out.append({
        'line': line,
        'text': text,
        'start': a / 100,
        'end': b / 100,
        'words': [{'w': w, 'start': cuts[k] / 100, 'end': cuts[k+1] / 100} for k, w in enumerate(words)],
    })

json.dump({'duration': len(x) / 16000, 'phrases': out}, open(f'{ROOT}/src/timeline.json', 'w'), ensure_ascii=False, indent=1)
for p in out:
    print(f"{p['start']:6.2f}-{p['end']:6.2f} " + ' | '.join(f"{w['w']}@{w['start']:.2f}" for w in p['words']))
