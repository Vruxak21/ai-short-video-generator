"use client"
import React, { useState, useContext, useEffect } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '../../../@/components/ui/button';
import axios from 'axios';
import CustomLoading from '@/app/dashboard/create-new/_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
import PlayerDialog from '@/app/dashboard/_components/PlayerDialog';
import { useUser } from '@clerk/nextjs';
import { VideoData } from '@/configs/schema';
import { db } from '@/configs/db';
import { useRouter } from 'next/router';

function CreateNew() {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [videoScript, setVideoScript] = useState();
    const [audioFileUrl, setAudioFileUrl] = useState();
    const [captions, setCaptions] = useState();
    const [imageList, setImageList] = useState([]);
    const [playVideo, setPlayVideo] = useState(false); // Initially set to false
    const [videoId, setVideoId] = useState(null); // Initially set to null
    const { videoData, setVideoData } = useContext(VideoDataContext);
    const { user } = useUser();

    const onHandleInputChange = (fieldName, fieldValue) => {
        console.log(fieldName, fieldValue);
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const onCreateClickHandler = () => {
        // Reset playVideo and videoId when starting a new video generation
        setPlayVideo(false);
        setVideoId(null);
        GetVideoScript();
    };

    const GetVideoScript = async () => {
        setLoading(true);
        const prompt = 'Write a script to generate ' + formData.duration + ' video on topic: ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and ContentText as field';
        console.log(prompt);

        try {
            const resp = await axios.post('/api/get-video-script', {
                prompt: prompt
            });
            if (resp.data.result && Array.isArray(resp.data.result)) {
                setVideoData(prev => ({
                    ...prev,
                    'videoScript': resp.data.result
                }));
                setVideoScript(resp.data.result);
                await GenerateAudioFile(resp.data.result);
            } else {
                console.error('Invalid video script format');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error generating video script:', error);
            setLoading(false);
        }
    };

    const GenerateAudioFile = async (videoScriptData) => {
        setLoading(true);
        let script = '';
        const id = uuidv4();
        
        if (Array.isArray(videoScriptData)) {
            videoScriptData.forEach(item => {
                script += (item.ContentText || '') + ' ';
            });
        }

        try {
            const resp = await axios.post('/api/generate-audio', {
                text: script,
                id: id
            });
            setVideoData(prev => ({
                ...prev,
                'audioFileUrl': resp.data.result
            }));
            setAudioFileUrl(resp.data.result);
            resp.data.result && await GenerateAudioCaption(resp.data.result, videoScriptData);
        } catch (error) {
            console.error('Error generating audio:', error);
            setLoading(false);
        }
    };

    const GenerateAudioCaption = async (audioFileUrl, videoScriptData) => {
        setLoading(true);
        console.log(audioFileUrl);
        try {
            const resp = await axios.post('/api/generate-caption', {
                audioFileUrl: audioFileUrl
            });
            setCaptions(resp?.data?.result);
            setVideoData(prev => ({
                ...prev,
                'captions': resp.data.result
            }));
            resp.data.result && await GenerateImage(videoScriptData);
        } catch (error) {
            console.error('Error generating captions:', error);
            setLoading(false);
        }
    };

    const GenerateImage = async (videoScriptData) => {
        let images = [];
    
        if (!Array.isArray(videoScriptData)) {
            console.error('Invalid video script data');
            setLoading(false);
            return;
        }
    
        for (const element of videoScriptData) {
            try {
                const resp = await axios.post('/api/generate-image', {
                    prompt: element.imagePrompt
                });
                console.log(`Image URL for prompt "${element.imagePrompt}":`, resp.data.result); // Corrected line
                images.push(resp.data.result);
            } catch (e) {
                console.log('Error generating image:', e);
            }
        }
        setVideoData(prev => ({
            ...prev,
            'imageList': images
        }));
        setImageList(images);
        setLoading(false);
    };

    useEffect(() => {
        console.log(videoData);
        if (Object.keys(videoData).length === 4) {
            SaveVideoData(videoData);
        }
    }, [videoData]);

    const SaveVideoData = async (videoData) => {
        setLoading(true);
        try {
            // Ensure user is authenticated
            if (!user) {
                console.error('User not authenticated');
                setLoading(false);
                return;
            }
    
            // Prepare data for database insertion
            const dataToSave = {
                script: videoData.videoScript,
                audioFileUrl: videoData.audioFileUrl,
                captions: videoData.captions,
                imageList: videoData.imageList,
                createdBy: user.id
            };
    
            // Insert video data into the database
            const result = await db.insert(VideoData).values(dataToSave).returning(); // Use .returning() to get the inserted record
    
            if (result && result.length > 0) {
                console.log('Video data saved successfully', result);
                setVideoId(result[0].id); // Update videoId with the newly generated video's ID
                setPlayVideo(true); // Set playVideo to true to show the PlayerDialog
            } else {
                console.error('Failed to save video data: No result returned');
            }
        } catch (error) {
            console.error('Error saving video data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='md:px-20'>
            <h2 className='font-bold text-4xl text-primary text-center'>Create new</h2>
            <div className='mt-10 shadow-md p-10'>
                <SelectTopic onUserSelect={onHandleInputChange} />
                <SelectStyle onUserSelect={onHandleInputChange} />
                <SelectDuration onUserSelect={onHandleInputChange} />
                <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
            </div>
            <CustomLoading loading={loading} />
            {playVideo && videoId && <PlayerDialog playVideo={playVideo} videoId={videoId} onClose={() => setPlayVideo(false)} />}
        </div>
    );
}

export default CreateNew;