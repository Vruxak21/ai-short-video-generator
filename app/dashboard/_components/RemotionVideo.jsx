import React from "react";
import { 
  AbsoluteFill, 
  Audio, 
  Img, 
  interpolate, 
  Sequence, 
  useCurrentFrame, 
  useVideoConfig 
} from "remotion";

function RemotionVideo({ 
  script, 
  imageList, 
  audioFileUrl, 
  captions, 
  setDurationInFrame 
}) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const getDurationFrame = () => {
    const duration = (captions[captions?.length - 1]?.end / 1000) * fps;
    setDurationInFrame(duration);
    return duration;
  };

  const getCurrentCaptions = () => {
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption ? currentCaption?.text : "";
  };

  return (
    <AbsoluteFill className="bg-black">
      {imageList?.map((item, index) => {
        const startTime = (index * getDurationFrame()) / imageList?.length;
        const duration = getDurationFrame();
        
        const scale = (index) => interpolate(
          frame, 
          [startTime, startTime + duration / 2, startTime + duration], 
          index % 2 === 0 ? [1, 1.6, 1] : [1.8, 1, 1.8],
          { 
            extrapolateLeft: "clamp", 
            extrapolateRight: "clamp" 
          }
        );

        return (
          <Sequence 
            key={index} 
            from={startTime} 
            durationInFrames={getDurationFrame()}
          >
            <AbsoluteFill style={{ 
              justifyContent: "center", 
              alignItems: "center" 
            }}>
              <Img 
                src={item} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover", 
                  transform: `scale(${scale(index)})` 
                }} 
              />
              
              {/* Captions at the bottom */}
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  padding: '80px',
                  color: 'white', 
                  textAlign: 'center' 
                }}
              >
                <h2 className="text-2xl font-bold">
                  {getCurrentCaptions()}
                </h2>
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
      
      {audioFileUrl && <Audio src={audioFileUrl} />}
    </AbsoluteFill>
  );
}

export default RemotionVideo;