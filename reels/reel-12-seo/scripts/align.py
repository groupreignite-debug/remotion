# Aligns speech-to-text word timings onto the exact script words.
# Usage: python3 scripts/align.py transcript_words.json duration > vo/timestamps.json
import difflib, json, re, sys

SCRIPT = [
    'زبونك عم يدوّر عليك هلّق… وعم يلاقي منافسك. ليش؟',
    'لأنو الموقع الحلو ما بيكفّي. غوغل لازم يلاقيه، يفهمو، ويوثق فيه. وهيدا اسمو SEO.',
    'تخيّل غوغل مكتبة ضخمة، وموقعك كتاب فيها.',
    'إذا الكتاب مش مسجّل، ما حدا رح يلاقيه. هيدا اسمو Indexing.',
    'وإذا الغلاف مكتوب عليه بس "أهلا وسهلا"، المكتبة ما بتعرف عن شو الكتاب.',
    'والزبون ما بيكتب اسمك… بيكتب شو بدّو. مثلاً: "طبيب أسنان بالأشرفية".',
    'إذا موقعك ما فيه هالكلمات، ما رح تطلع.',
    'وتنين شغلات سريعة: غوغل بيحب الموقع اللي بيفتح بسرعة عالموبايل.',
    'وإذا عندك محل، الـ Google Business Profile بيحطّك عالخريطة.',
    'بدك تعرف إذا غوغل شايفك؟ اكتب بغوغل site، نقطتين، وبعدها اسم موقعك.',
    'إذا ما طلع شي… غوغل بعدو ما شاف موقعك.',
    'الموقع الحلو ما بيكفّي. لازم يكون موقع بينلاقى.',
    'اكتب SEO بالكومنتات، ومنعملك فحص سريع لموقعك.',
]

def norm(s):
    s = s.lower()
    s = re.sub(r'[ً-ْـ]', '', s)
    s = re.sub('[إأآا]', 'ا', s).replace('ى', 'ي').replace('ة', 'ه')
    return re.sub(r'[^\w]', '', s)

stt = [w for w in json.load(open(sys.argv[1])) if norm(w['text'])]
duration = float(sys.argv[2])
script = [(li, t) for li, l in enumerate(SCRIPT) for t in l.split()]

a = [norm(t) for _, t in script]
b = [norm(w['text']) for w in stt]
n, m = len(a), len(b)
sim = lambda x, y: difflib.SequenceMatcher(None, x, y).ratio()
G = -0.4
D = [[0.0] * (m + 1) for _ in range(n + 1)]
P = [[None] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    D[i][0] = i * G; P[i][0] = 'u'
for j in range(1, m + 1):
    D[0][j] = j * G; P[0][j] = 'l'
for i in range(1, n + 1):
    for j in range(1, m + 1):
        opts = [(D[i-1][j-1] + sim(a[i-1], b[j-1]) * 2 - 0.6, 'd'), (D[i-1][j] + G, 'u'), (D[i][j-1] + G, 'l')]
        D[i][j], P[i][j] = max(opts)
i, j = n, m
match = [None] * n
while i > 0 or j > 0:
    p = P[i][j]
    if p == 'd':
        match[i-1] = j-1; i -= 1; j -= 1
    elif p == 'u':
        i -= 1
    else:
        j -= 1

times = [None] * n
for k, mj in enumerate(match):
    if mj is not None:
        times[k] = [stt[mj]['start'], stt[mj]['end']]
# Fill unmatched words by interpolating between neighbours.
for k in range(n):
    if times[k] is None:
        prev = next((times[x][1] for x in range(k - 1, -1, -1) if times[x]), 0.0)
        nxt = next((times[x][0] for x in range(k + 1, n) if times[x]), duration)
        times[k] = [prev, nxt]
        print(f'unmatched: {script[k][1]} -> {times[k]}', file=sys.stderr)

lines = []
for li, text in enumerate(SCRIPT):
    ws = [{'text': script[k][1], 'start': round(times[k][0], 3), 'end': round(times[k][1], 3)} for k in range(n) if script[k][0] == li]
    lines.append({'text': text, 'start': ws[0]['start'], 'end': ws[-1]['end'], 'words': ws})
print(json.dumps({'duration': duration, 'source': 'ElevenLabs eleven_multilingual_v2 TTS; word timings from ElevenLabs Scribe aligned to the script', 'lines': lines}, ensure_ascii=False, indent='\t'))
