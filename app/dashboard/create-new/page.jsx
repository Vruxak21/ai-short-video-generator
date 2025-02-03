"use client"
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '../../../components/ui/button'
import axios from 'axios'
import CustomLoading from 'C:/Users/patel/OneDrive/Documents/Nirma University/Semester 4/FSWD/ai-short-video-generator/app/dashboard/create-new/_components/CustomLoading'
import { v4 as uuidv4 } from 'uuid';

function CreateNew() {

    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [videoScript, setVideoScript] = useState();
    const [audioFileUrl, setAudioFileUrl] = useState();
    const [captions, setCaptions] = useState([]);
    const [images, setImages] = useState([]);

    const onHandleInputChange = (fieldName, fieldValue) => {
        console.log(fieldName, fieldValue)
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const onCreateClickHandler = async () => {
        setLoading(true);
        try {
            const script = await GetVideoScript();
            await GenerateAudioFile(script);
            await GenerateCaptions();
            await GenerateImages(script);
        } catch (error) {
            console.error("Error generating video content:", error);
        } finally {
            setLoading(false);
        }
    }

    // Get video script
    const GetVideoScript = async () => {
        const prompt = 'Write a script to generate ' + formData.duration + ' video on topic : Interesting ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and ContentText as field'
        console.log(prompt)
        const result = await axios.post('/api/get-video-script', {
            prompt: prompt
        });
        setVideoScript(result.data.result);
        return result.data.result;
    }

    const GenerateAudioFile = async (videoScriptData) => {
        const id = uuidv4();
        const result = await axios.post('/api/generate-audio', {
            text: videoScriptData,
            id: id
        });
        setAudioFileUrl(result.data.result);
    }

    const GenerateCaptions = async () => {
        const result = await axios.post('/api/generate-caption', {
            audioFileUrl: audioFileUrl
        });
        setCaptions(result.data.result);
    }

    const GenerateImages = async (script) => {
        const imagePrompts = script.map(scene => scene.imagePrompt);
        const generatedImages = await Promise.all(imagePrompts.map(prompt => axios.post('/api/generate-image', { prompt })));
        setImages(generatedImages.map(res => res.data.result));
    }

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
        </div>
    )
}

export default CreateNew