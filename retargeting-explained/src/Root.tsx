import { Composition, Folder, Still } from "remotion";
import { DUR, FPS, INTRO_FRAMES } from "./cues";
import { Cover } from "./Cover";
import { RetargetingExplained } from "./RetargetingExplained";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="shou-yaani">
      <Composition
        id="RetargetingExplained"
        component={RetargetingExplained}
        durationInFrames={INTRO_FRAMES + Math.ceil(DUR * FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Still
        id="RetargetingCover"
        component={Cover}
        width={1080}
        height={1920}
      />
    </Folder>
  );
};
