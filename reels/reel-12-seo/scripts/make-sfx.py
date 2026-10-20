# Synthesizes the soft UI sound effects used under the voiceover.
# Usage: python3 scripts/make-sfx.py public/sfx
import math, random, struct, sys, wave, os

SR = 48000
out = sys.argv[1]
os.makedirs(out, exist_ok=True)

def write(name, samples):
    peak = max(1e-9, max(abs(s) for s in samples))
    with wave.open(os.path.join(out, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s / peak * 0.9)) * 32767)) for s in samples))

def env(i, n, attack, decay):
    t = i / SR
    a = min(1, t / attack) if attack > 0 else 1
    return a * math.exp(-t / decay)

rnd = random.Random(7)

# Key tick: short filtered noise click + tiny body.
for v in range(3):
    n = int(SR * 0.05); lp = 0; s = []
    for i in range(n):
        x = rnd.uniform(-1, 1)
        lp += (x - lp) * (0.35 + v * 0.1)
        body = math.sin(2 * math.pi * (1800 + v * 250) * i / SR) * 0.4
        s.append((lp + body) * env(i, n, 0.0005, 0.006 + v * 0.002))
    write(f'tick{v}.wav', s)

# Whoosh: band-swept noise.
n = int(SR * 0.55); s = []; lp = 0; lp2 = 0
for i in range(n):
    p = i / n
    c = 0.02 + 0.25 * math.sin(math.pi * p) ** 2
    x = rnd.uniform(-1, 1)
    lp += (x - lp) * c
    lp2 += (lp - lp2) * c
    s.append((lp - lp2) * math.sin(math.pi * p) ** 1.5)
write('whoosh.wav', s)

# Stamp thud: low sine drop + noise transient.
n = int(SR * 0.45); s = []; ph = 0
for i in range(n):
    t = i / SR
    f = 55 + 90 * math.exp(-t / 0.03)
    ph += 2 * math.pi * f / SR
    s.append(math.sin(ph) * math.exp(-t / 0.12) + rnd.uniform(-1, 1) * math.exp(-t / 0.008) * 0.5)
write('thud.wav', s)

# Error blip: two short descending soft square tones.
n = int(SR * 0.32); s = []
for i in range(n):
    t = i / SR
    f = 440 if t < 0.13 else 311
    lt = t if t < 0.13 else t - 0.15
    if 0.13 <= t < 0.15:
        s.append(0); continue
    sq = sum(math.sin(2 * math.pi * f * k * t) / k for k in (1, 3, 5))
    s.append(sq * math.exp(-lt / 0.07) * min(1, lt / 0.003))
write('error.wav', s)

# Chime: bell partials.
n = int(SR * 1.6); s = []
for i in range(n):
    t = i / SR
    v = 0
    for f, a, d in ((1318.5, 1, 0.6), (1975.5, 0.5, 0.4), (2637, 0.3, 0.25), (659.25, 0.4, 0.9)):
        v += a * math.sin(2 * math.pi * f * t) * math.exp(-t / d)
    s.append(v * min(1, t / 0.002))
write('chime.wav', s)

# Ignite: soft airy flare.
n = int(SR * 0.6); s = []; lp = 0
for i in range(n):
    p = i / n
    x = rnd.uniform(-1, 1)
    lp += (x - lp) * (0.05 + 0.3 * p)
    s.append(lp * math.sin(math.pi * min(1, p * 1.6)) * (1 - p))
write('ignite.wav', s)

# Pop: soft UI pop for cards.
n = int(SR * 0.12); s = []; ph = 0
for i in range(n):
    t = i / SR
    f = 600 + 500 * math.exp(-t / 0.02)
    ph += 2 * math.pi * f / SR
    s.append(math.sin(ph) * math.exp(-t / 0.03))
write('pop.wav', s)
