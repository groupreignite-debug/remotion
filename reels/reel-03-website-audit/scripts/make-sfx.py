"""Synthesises the sound-design layer (no third-party samples needed)."""
import wave, numpy as np

ROOT = __file__.rsplit('/scripts/', 1)[0]
SR = 44100
rng = np.random.default_rng(7)

def t(d):
    return np.arange(int(SR * d)) / SR

def lowpass(x, a):
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y

def save(name, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    fade = min(len(x), 200)
    x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(f'{ROOT}/public/sfx/{name}.wav', 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x * 32767).astype(np.int16).tobytes())

# Countdown tick: short woody click
tt = t(0.09)
tick = np.sin(2 * np.pi * 1850 * tt) * np.exp(-tt * 90) + 0.5 * np.sin(2 * np.pi * 3700 * tt) * np.exp(-tt * 160)
tick += rng.normal(0, 1, len(tt)) * np.exp(-tt * 400) * 0.4
save('tick', tick, 0.55)

# Whoosh: band-limited noise with a rising-then-falling sweep
tt = t(0.55)
env = np.sin(np.pi * np.clip(tt / 0.55, 0, 1)) ** 2
noise = rng.normal(0, 1, len(tt))
a = 0.02 + 0.25 * np.sin(np.pi * tt / 0.55) ** 2
y = np.zeros_like(noise); acc = 0.0
for i, v in enumerate(noise):
    acc += a[i] * (v - acc); y[i] = acc
save('whoosh', (y - lowpass(y, 0.01)) * env, 0.45)

# Dull buzzer (FAIL): detuned low saws, low-passed
tt = t(0.6)
saw = sum(((tt * f) % 1 - 0.5) for f in (110, 111.7, 55.4))
buzz = lowpass(saw, 0.06) * np.minimum(1, tt / 0.01) * np.exp(-np.maximum(0, tt - 0.4) * 18)
save('buzzer', buzz, 0.5)

# Clean chime (PASS): bell partials
tt = t(1.4)
chime = sum(amp * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, amp, d in [(1318.5, 1, 3.2), (1975.5, 0.6, 4), (2637, 0.35, 6), (3951, 0.15, 9)])
save('chime', chime + 0.8 * np.concatenate([np.zeros(int(SR * 0.09)), sum(amp * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, amp, d in [(1760, 1, 3.2), (2637, 0.5, 5)])[:-int(SR * 0.09)]]), 0.45)

# Pop (tick marks / card reveals)
tt = t(0.12)
pop = np.sin(2 * np.pi * (300 + 900 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 35)
save('pop', pop, 0.5)

# Stamp thud
tt = t(0.5)
thud = np.sin(2 * np.pi * (45 + 80 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9) + rng.normal(0, 1, len(tt)) * np.exp(-tt * 60) * 0.5
save('stamp', lowpass(thud, 0.2), 0.8)

# Keyboard click
tt = t(0.05)
key = rng.normal(0, 1, len(tt)) * np.exp(-tt * 180) + np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 250) * 0.6
save('key', key - lowpass(key, 0.05), 0.35)

# Snap-shut: short dark slam
tt = t(0.25)
snap = rng.normal(0, 1, len(tt)) * np.exp(-tt * 40)
save('snap', lowpass(snap, 0.15) + np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 20), 0.6)
