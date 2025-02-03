"use client"
import React, { useState, useContext, useEffect } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '../../../components/ui/button';
import axios from 'axios';
import CustomLoading from 'C:/Users/patel/OneDrive/Documents/Nirma University/Semester 4/FSWD/ai-short-video-generator/app/dashboard/create-new/_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from 'C:/Users/patel/OneDrive/Documents/Nirma University/Semester 4/FSWD/ai-short-video-generator/app/_context/VideoDataContext';
import PlayerDialog from 'C:/Users/patel/OneDrive/Documents/Nirma University/Semester 4/FSWD/ai-short-video-generator/app/dashboard/_components/PlayerDialog';

function CreateNew() {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [videoScript, setVideoScript] = useState();
    const [audioFileUrl, setAudioFileUrl] = useState();
    const [captions, setCaptions] = useState();
    const [imageList, setImageList] = useState([]);
    const { videoData, setVideoData } = useContext(VideoDataContext);

    const onHandleInputChange = (fieldName, fieldValue) => {
        console.log(fieldName, fieldValue);

        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const onCreateClickHandler = () => {
        GetVideoScript();
    };

    const GetVideoScript = async () => {
        setLoading(true);
        const prompt = 'Write a script to generate ' + formData.duration + ' video on topic: ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and ContentText as field';
        console.log(prompt);

        const resp = await axios.post('/api/get-video-script', {
            prompt: prompt
        });
        if (resp.data.result) {
            setVideoData(prev => ({
                ...prev,
                'videoScript': resp.data.result
            }));
            setVideoScript(resp.data.result);
            await GenerateAudioFile(resp.data.result);
        }
    };

    const GenerateAudioFile = async (videoScriptData) => {
        setLoading(true);
        let script = '';
        const id = uuidv4();
        videoScriptData.forEach(item => {
            script = script + item.ContentText + ' ';
        });

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
    };

    const GenerateAudioCaption = async (audioFileUrl, videoScriptData) => {
        setLoading(true);
        console.log(audioFileUrl);
        const resp = await axios.post('/api/generate-caption', {
            audioFileUrl: audioFileUrl
        });
        setCaptions(resp?.data?.result);
        setVideoData(prev => ({
            ...prev,
            'captions': resp.data.result
        }));
        resp.data.result && await GenerateImage(videoScriptData);
    };

    const GenerateImage = async (videoScriptData) => {
        let images = [];

        for (const element of videoScriptData) {
            try {
                const resp = await axios.post('/api/generate-image', {
                    prompt: element.imagePrompt
                });
                console.log(`Image URL for prompt "${element.imagePrompt}":`, resp.data.result);
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
        console.log('Video Data:', videoData);
        console.log('Image List:', imageList);
    }, [videoData, imageList]);

    return (
        <div className='md:px-20'>
            <h2 className='font-bold text-4xl text-primary text-center'>Create new</h2>

            <div className='mt-10 shadow-md p-10'>
                {/* Select Topic */}
                <SelectTopic onUserSelect={onHandleInputChange} />
                {/* Select Style */}
                <SelectStyle onUserSelect={onHandleInputChange} />
                {/* Duration */}
                <SelectDuration onUserSelect={onHandleInputChange} />
                {/* Create Button */}
                <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
            </div>
            <CustomLoading loading={loading} />
            {/* <PlayerDialog playVideo={} videoId={}/> */}
        </div>
    );
}

export default CreateNew;