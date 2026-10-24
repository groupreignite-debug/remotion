import React from "react";
import { Composition, staticFile, Still } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Cover } from "./Cover";
import { BrandColors } from "./BrandColors";
import { END_CARD_S, VO_END } from "./timeline";
import { ASSETS } from "./theme";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Still id="Cover" component={Cover} width={1080} height={1920} />
    <Composition
      id="BrandColors"
      component={BrandColors}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={Math.ceil((VO_END + END_CARD_S) * FPS)}
      calculateMetadata={async () => {
        const vo = ASSETS.vo ? await getAudioDurationInSeconds(staticFile("audio/vo.mp3")) : VO_END;
        return { durationInFrames: Math.ceil((Math.max(vo, VO_END) + END_CARD_S) * FPS) };
      }}
    />
  </>
);
