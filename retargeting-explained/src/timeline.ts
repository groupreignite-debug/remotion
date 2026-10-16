import type { CSSProperties } from "react";
import { Easing } from "remotion";

// A frame-driven port of the GSAP timeline the HyperFrames build was authored with. Every scene
// declares its tweens once (film seconds, from the VO word timings) and reads the value of a property
// at the current film time, computed from useCurrentFrame(). Nothing runs on its own clock, so every
// render is identical. It keeps GSAP's semantics so the port stays line-for-line with the reference:
// - `to` tweens start from the value the property had when they started;
// - `fromTo` tweens show their `from` values before they start (immediateRender);
// - when tweens on the same property overlap, the one that rendered last wins, as in playback.

export type Ease = (x: number) => number;

// GSAP's eases in terms of Remotion's Easing (GSAP power1 = quad, power2 = cubic, power3 = quart)
export const ease = {
  none: (x: number) => x,
  p1i: Easing.in(Easing.quad),
  p1o: Easing.out(Easing.quad),
  p1io: Easing.inOut(Easing.quad),
  p2i: Easing.in(Easing.cubic),
  p2o: Easing.out(Easing.cubic),
  p2io: Easing.inOut(Easing.cubic),
  p3i: Easing.in(Easing.poly(4)),
  p3o: Easing.out(Easing.poly(4)),
  p3io: Easing.inOut(Easing.poly(4)),
  expoO: Easing.out(Easing.exp),
  sineO: Easing.out(Easing.sin),
  sineIO: Easing.inOut(Easing.sin),
  backO: (overshoot: number) => Easing.out(Easing.back(overshoot)),
};

type V = number | string;
type Vars = Record<string, V>;
type Opts = {
  d?: number;
  ease?: Ease;
  yoyo?: boolean;
  repeat?: number;
  imm?: boolean;
  stagger?: number;
};
type Tween = {
  t: number;
  d: number;
  total: number;
  from: V | null;
  to: V;
  ease: Ease;
  yoyo: boolean;
  repeat: number;
  imm: boolean;
  order: number;
  start: V | null;
};
type Track = { base: V; tweens: Tween[]; v0: V | null };

const NUM = /-?\d*\.?\d+(?:e-?\d+)?/g;
const lerp = (a: V, b: V, p: number): V => {
  if (typeof a === "number" && typeof b === "number") {
    return a + (b - a) * p;
  }
  const sa = String(a);
  const sb = String(b);
  const na = sa.match(NUM);
  const nb = sb.match(NUM);
  if (!na || !nb || na.length !== nb.length) {
    return p > 0 ? b : a;
  }
  let k = 0;
  return sb.replace(NUM, () => {
    const v = Number(na[k]) + (Number(nb[k]) - Number(na[k])) * p;
    k++;
    return String(Math.round(v * 1000) / 1000);
  });
};

// CSS values an element has before any tween touches it
const DEFAULTS: Vars = {
  x: 0,
  y: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  opacity: 1,
  filter: "blur(0px)",
};

export class Timeline {
  private tracks = new Map<string, Track>();
  private bases = new Map<string, Vars>();
  private order = 0;

  // the element's own CSS values for properties that are tweened (e.g. a ring that starts hidden)
  base(el: string | string[], vars: Vars) {
    for (const e of [el].flat()) {
      this.bases.set(e, { ...this.bases.get(e), ...vars });
    }
    return this;
  }

  fromTo(el: string | string[], from: Vars, to: Vars, t: number, o: Opts = {}) {
    [el].flat().forEach((e, i) => {
      const at = t + i * (o.stagger ?? 0);
      for (const prop of Object.keys(from)) {
        if (prop in to) {
          this.add(e, prop, from[prop], to[prop], at, o, o.imm ?? true);
        } else {
          this.add(
            e,
            prop,
            from[prop],
            from[prop],
            at,
            { d: 0 },
            o.imm ?? true,
          );
        }
      }
      for (const prop of Object.keys(to)) {
        if (!(prop in from)) {
          this.add(e, prop, null, to[prop], at, o, false);
        }
      }
    });
    return this;
  }

  to(el: string | string[], to: Vars, t: number, o: Opts = {}) {
    [el].flat().forEach((e, i) => {
      for (const prop of Object.keys(to)) {
        this.add(e, prop, null, to[prop], t + i * (o.stagger ?? 0), o, false);
      }
    });
    return this;
  }

  set(el: string | string[], vars: Vars, t: number) {
    return this.to(el, vars, t, { d: 0 });
  }

  // the reference build's shared moves
  rise(el: string | string[], t: number, d = 0.7, y = 44) {
    return this.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0 }, t, {
      d,
      ease: ease.p3o,
    });
  }

  out(el: string | string[], t: number, d = 0.35) {
    return this.to(el, { opacity: 0 }, t, { d, ease: ease.p2i });
  }

  pop(el: string | string[], t: number, d = 0.5) {
    return this.fromTo(
      el,
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1 },
      t,
      { d, ease: ease.backO(2.2) },
    );
  }

  pulse(el: string, t: number, s = 1.08) {
    return this.fromTo(el, { scale: 1 }, { scale: s }, t, {
      d: 0.16,
      yoyo: true,
      repeat: 1,
      ease: ease.p2o,
    });
  }

  ring(el: string, t: number) {
    return this.fromTo(
      el,
      { opacity: 0.9, scale: 0.3 },
      { opacity: 0, scale: 1.6 },
      t,
      {
        d: 0.6,
        ease: ease.p2o,
        imm: false,
      },
    );
  }

  // GSAP keyframes array (e.g. a shake): even segments, power1.inOut each
  keys(el: string, prop: string, values: number[], t: number, d: number) {
    const seg = d / (values.length - 1);
    values.slice(1).forEach((v, i) => {
      this.to(el, { [prop]: v }, t + i * seg, { d: seg, ease: ease.p1io });
    });
    return this;
  }

  private add(
    el: string,
    prop: string,
    from: V | null,
    to: V,
    t: number,
    o: Opts,
    imm: boolean,
  ) {
    const key = `${el}.${prop}`;
    let track = this.tracks.get(key);
    if (!track) {
      track = {
        base: this.bases.get(el)?.[prop] ?? DEFAULTS[prop] ?? 0,
        tweens: [],
        v0: null,
      };
      this.tracks.set(key, track);
    }
    const d = o.d ?? 0.5;
    const repeat = o.repeat ?? 0;
    track.tweens.push({
      t,
      d,
      total: d * (repeat + 1),
      from,
      to,
      ease: o.ease ?? ease.p1o,
      yoyo: o.yoyo ?? false,
      repeat,
      imm: imm && from !== null,
      order: this.order++,
      start: null,
    });
    track.tweens.sort((a, b) => a.t - b.t || a.order - b.order);
    track.v0 = null;
    for (const tw of track.tweens) {
      tw.start = null;
    }
  }

  private valueAt(track: Track, time: number, limit: number): V {
    let best = -1;
    let bestTime = -Infinity;
    for (let i = 0; i < limit; i++) {
      const tw = track.tweens[i];
      if (time < tw.t) {
        break;
      }
      const rendered = Math.min(time, tw.t + tw.total);
      if (rendered >= bestTime) {
        best = i;
        bestTime = rendered;
      }
    }
    if (best < 0) {
      if (track.v0 === null) {
        // immediateRender: every fromTo writes its `from` when the timeline is built
        track.v0 = [...track.tweens]
          .sort((a, b) => a.order - b.order)
          .reduce<V>((v, tw) => (tw.imm ? (tw.from as V) : v), track.base);
      }
      return track.v0;
    }
    const tw = track.tweens[best];
    if (tw.start === null) {
      tw.start = tw.from ?? this.valueAt(track, tw.t, best);
    }
    const local = time - tw.t;
    let p = 1;
    let cycle = tw.repeat;
    if (tw.d > 0 && local < tw.total) {
      cycle = Math.floor(local / tw.d);
      p = (local - cycle * tw.d) / tw.d;
    }
    if (tw.yoyo && cycle % 2 === 1) {
      p = 1 - p;
    }
    return p >= 1 ? tw.to : lerp(tw.start, tw.to, tw.ease(p));
  }

  get(el: string, prop: string, time: number): V | undefined {
    const track = this.tracks.get(`${el}.${prop}`);
    return track ? this.valueAt(track, time, track.tweens.length) : undefined;
  }

  num(el: string, prop: string, time: number, fallback = 0): number {
    const v = this.get(el, prop, time);
    return typeof v === "number" ? v : fallback;
  }

  // CSS for an element at film time `time`: only the properties that are tweened are set
  style(el: string, time: number): CSSProperties {
    const g = (p: string) => this.get(el, p, time);
    const s: CSSProperties = {};
    const x = g("x");
    const y = g("y");
    if (x !== undefined || y !== undefined) {
      s.translate = `${x ?? 0}px ${y ?? 0}px`;
    }
    const r = g("rotation");
    if (r !== undefined) {
      s.rotate = `${r}deg`;
    }
    const sc = g("scale");
    const sx = g("scaleX");
    const sy = g("scaleY");
    if (sc !== undefined || sx !== undefined || sy !== undefined) {
      const k = Number(sc ?? 1);
      s.scale = `${k * Number(sx ?? 1)} ${k * Number(sy ?? 1)}`;
    }
    for (const p of [
      "opacity",
      "filter",
      "boxShadow",
      "textShadow",
      "color",
      "borderColor",
      "backgroundColor",
      "strokeDashoffset",
      "strokeDasharray",
    ] as const) {
      const v = g(p);
      if (v !== undefined) {
        (s as Record<string, V>)[p] = v;
      }
    }
    return s;
  }
}
