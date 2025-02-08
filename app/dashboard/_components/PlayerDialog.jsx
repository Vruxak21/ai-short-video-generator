import React, { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/@/components/ui/dialog";
import RemotionVideo from "./RemotionVideo";
import { Button } from "../../../@/components/ui/button";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function PlayerDialog({ playVideo, videoId, onClose }) {
  const [videoData, setVideoData] = useState(null);
  const [durationInFrame, setDurationInFrame] = useState(100);
  const router = useRouter();

  useEffect(() => {
      if (videoId) {
          GetVideoData();
      }
  }, [videoId]);

  const GetVideoData = async () => {
      try {
          const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));
          if (result.length > 0) {
              setVideoData(result[0]);
          }
      } catch (error) {
          console.error("Error fetching video data:", error);
      }
  };

  return (
      <Dialog open={playVideo} onOpenChange={onClose}>
          <DialogContent className="w-[500px] h-[650px] flex flex-col items-center">
              <DialogHeader>
                  <DialogTitle className="text-3xl font-bold my-5">
                      Your video is ready
                  </DialogTitle>
                  <DialogDescription>
                      {videoData ? (
                          <Player
                              component={RemotionVideo}
                              durationInFrames={Number(durationInFrame.toFixed(0))}
                              compositionWidth={300}
                              compositionHeight={450}
                              fps={30}
                              controls={true}
                              inputProps={{
                                  ...videoData,
                                  setDurationInFrame: setDurationInFrame,
                              }}
                          />
                      ) : (
                          <p>Loading video data...</p>
                      )}
                      <div className="flex gap-10 mt-10">
                          <Button variant="ghost" onClick={() => { router.replace('/dashboard'); onClose(); }}>
                              Cancel
                          </Button>
                          <Button>Export</Button>
                      </div>
                  </DialogDescription>
              </DialogHeader>
          </DialogContent>
      </Dialog>
  );
}

export default PlayerDialog;