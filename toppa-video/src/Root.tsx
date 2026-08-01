import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import "./tailwind.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ToppaPromo"
        component={MainVideo}
        durationInFrames={11010}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
