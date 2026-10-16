import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { END, FPS, LINES, W } from "./cues";
import { ar, C, en } from "./world";

// Arabic subtitles: exactly the spoken line, one line at a time, synced to Salem's words and split at
// his own pauses. Only the key terms are Latin (they are drawn orange). One text layer: the lines the
// centre already shows big are hidden here (03 FREEZE, 13 LINE, and the CTA half of 14).
// [first word slot, text, hidden]
const CUES: [number, string, boolean][] = [
  [0, "فتت مرة على موقع،", false],
  [4, "شفت جاكيت حلو… وفلّيت.", false],
  [8, "تاني يوم، صار الجاكيت لاحقك:", false],
  [13, "عـ Instagram، عـ YouTube، بكل مكان.", false],
  [19, "صدفة؟ لأ.", true],
  [21, "هيدا اسمو Retargeting.", false],
  [24, "يعني ترجع توصل للناس اللي شافوك قبل،", false],
  [31, "بس ما اشتروا.", false],
  [34, "تخيّل محل تياب.", false],
  [37, "حدا فات، جرّب، وطلع بلا ما يشتري.", false],
  [44, "البيّاع الشاطر ما بينساه.", false],
  [48, "بس يرجع يمرق، بيقلّو:", false],
  [53, '"بعدها القطعة ناطرتك."', false],
  [56, "عالإنترنت، الـ Pixel هوي البيّاع.", false],
  [62, "كود صغير بموقعك،", false],
  [65, "بيتذكّر مين فات، وعلى أي صفحة.", false],
  [71, "وليش هالشي مهم؟", false],
  [74, "لأن هيدا الشخص بيعرفك.", false],
  [78, "ما عم تبلّش معو من الصفر.", false],
  [84, "بس انتبه:", false],
  [86, "ما تفرجيه نفس الإعلان كل يوم، هيك بيزهق.", false],
  [94, "اللي شاف المنتج، فرجيه مرة تانية.", false],
  [101, "واللي حطّو بالسلة، ذكّرو إنو بعدو ناطرو.", false],
  [108, "وإذا اشترى؟ وقّف الإعلان عنو.", false],
  [113, "مش كل إعلان لازم يحكي مع ناس جداد.", true],
  [121, "أحياناً أقرب زبون… هوي اللي فات وفلّ.", true],
  [129, "موقعك فيه Pixel؟", false],
  [132, "اكتب PIXEL بالكومنتات، ومنقلّك كيف تتأكد.", true],
];

// each subtitle shows from its first word until the next one starts; at the end of a spoken line it
// stays 0.45s more (unless the next line comes sooner). Frames are film frames.
const lineEnd = (wi: number) =>
  Object.values(LINES).find((l) => wi >= l.w[0] && wi <= l.w[1])!.e;
const VISIBLE = CUES.filter(([, , hidden]) => !hidden);
export const SUBTITLES = CUES.map(([wi, text, hidden]) => {
  const k = VISIBLE.findIndex(([w]) => w === wi);
  const next = VISIBLE[k + 1];
  const nextStart = next ? W(next[0]) : END;
  const sameLine = next !== undefined && lineEnd(next[0]) === lineEnd(wi);
  const hide = sameLine
    ? nextStart - 0.18
    : Math.min(lineEnd(wi) + 0.45, nextStart - 0.18);
  return {
    text,
    startFrame: (Math.max(0.06, W(wi)) - 0.06) * FPS,
    endFrame: hide * FPS,
    hidden,
  };
});

const FADE = 0.12 * FPS;

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {SUBTITLES.filter(
        (s) => !s.hidden && frame >= s.startFrame && frame < s.endFrame + FADE,
      ).map((s) => (
        <div
          key={s.startFrame}
          style={{
            position: "absolute",
            left: 90,
            width: 840,
            top: 1430,
            height: 190,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(
              frame,
              [
                s.startFrame,
                s.startFrame + FADE,
                s.endFrame,
                s.endFrame + FADE,
              ],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <span
            style={{
              ...ar,
              display: "inline-block",
              maxWidth: 840,
              padding: "14px 32px",
              borderRadius: 24,
              background: "rgba(26, 26, 26, 0.86)",
              border: "1px solid rgba(245, 241, 234, 0.1)",
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.45,
              textAlign: "center",
              color: C.paper,
              whiteSpace: "normal",
            }}
          >
            {s.text.split(/([A-Za-z]+)/).map((part, i) =>
              i % 2 ? (
                <b key={i} style={{ ...en, fontWeight: 700, color: C.orange }}>
                  {part}
                </b>
              ) : (
                part
              ),
            )}
          </span>
        </div>
      ))}
    </AbsoluteFill>
  );
};
