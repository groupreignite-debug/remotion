// ElevenLabs sound effects (eleven_text_to_sound_v2), trimmed and peak-normalized to -1 dBFS.
// whoosh/ding/click/ignite reused from the "GA vs Pixel" reel; pop/flip/flash made for this reel.
export const SFX = {
  whoosh: "audio/sfx/el/whoosh.wav",
  pop: "audio/sfx/el/pop.wav",
  click: "audio/sfx/el/click.wav",
  flip: "audio/sfx/el/flip.wav",
  flash: "audio/sfx/el/flash.wav",
  ding: "audio/sfx/el/ding.wav",
  ignite: "audio/sfx/el/ignite.wav",
};
export const SFX_VOL: Record<keyof typeof SFX, number> = {
  whoosh: 0.18, pop: 0.3, click: 0.35, flip: 0.22, flash: 0.3, ding: 0.28, ignite: 0.45,
};
