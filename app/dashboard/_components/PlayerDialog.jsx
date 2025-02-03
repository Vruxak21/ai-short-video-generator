import React, { useState } from 'react'
import { Player } from "@remotion/player";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "C:/Users/patel/OneDrive/Documents/Nirma University/Semester 4/FSWD/ai-short-video-generator/@/components/ui/dialog"  
import RemotionVideo from './RemotionVideo';

function PlayerDialog({playVideo,videoId}) {

    const [openDialog,setOpenDialog]=useState(false);
    
    useEffect(()=>{
        setOpenDialog(playVideo)
    },[playVideo])

    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="text-3xl font-bold my-5">Your video is ready</DialogTitle>
                <DialogDescription>
                <Player
                    component={RemotionVideo}
                    durationInFrames={120}
                    compositionWidth={300}
                    compositionHeight={450}
                    fps={30}
                />
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default PlayerDialog