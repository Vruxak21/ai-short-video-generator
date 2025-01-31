"use client"
import React, { useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '../../../components/ui/button'
import axios from 'axios'
import CustomLoading from 'C:/Users/patel/OneDrive/Documents/Nirma University/Semester 4/FSWD/ai-short-video-generator/app/dashboard/create-new/_components/CustomLoading'
import { v4 as uuidv4 } from 'uuid';

const scriptData = 'Antica, the port city of Rome, pulsates with the lifeblood of the Empire. A melting pot of cultures and commerce, where fortunes are made and lost with every sunrise.Marcus Aurelius Flavius, a merchant with years of experience, assesses his latest delivery. Olive oil, the liquid gold of the Mediterranean, is his specialty. But lately, trade has become… complicated.Whispers of rising costs and shortages plague the market. Marcus seeks answers from a contact, a figure shrouded in mystery. He learns of disruption, of pirates operating unchecked, of a hidden plot.The seas, once dependable, have become treacherous. Pirate ships, like wraiths in the night, prey on Roman merchant vessels. It is said they are supported by those within Rome itself, who seek chaos for their own gain.Marcus, a man of the people, refuses to stand idly by. He begins to piece together fragments of information, charting the locations of pirate attacks and trade routes. A dangerous plan begins to take shape.He takes his evidence to the local legion. With their support, he leads a counter strike against the pirates. It is not an easy battle, but Roman discipline and courage prevail, routing the pirates.The disruption is quelled, trade flows freely once more, and the threat, for now, is eliminated. Marcus had saved the city and the Empire by confronting his adversity. And his courage is remembered for generations to come.'

function CreateNew() {

    const [formData, setFormData]=useState([]);
    const [loading, setLoading]=useState(false);
    const [videoScript, setVideoScript]=useState();

    const onHandleInputChange=(fieldName,fieldValue)=>{
        console.log(fieldName,fieldValue)
        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }))
    }

    const onCreateClickHandler=()=>{
        // GetVideoScript();
        GenerateAudioFile(scriptData);
    }

    //Get video script
    const GetVideoScript=async()=>{
        setLoading(true)
        const prompt='Write a script to generate '+formData.duration+' video on topic : Interesting '+formData.topic+' along with AI image prompt in '+formData.imageStyle+' format for each scene and give me result in JSON format with imagePrompt and ContentText as field'
        console.log(prompt)
        const result = await axios.post('/api/get-video-script', {
            prompt:prompt
        }).then(resp=>{
            // console.log(resp.data.result);
            setVideoScript(resp.data.result);
            GenerateAudioFile(resp.data.result);
        });
        setLoading(false);
    }

    const GenerateAudioFile=async(videoScriptData)=>{
        setLoading(true);
        let script='';
        const id = uuidv4();
        // videoScriptData.forEach(item=>{
        //     script=script+item.ContentText+'';
        // })
        // console.log(script);

        await axios.post('/api/generate-audio', {
            text:videoScriptData,
            id:id
        }).then(resp=>{
            console.log(resp.data);
        })
        setLoading(false);
    }

    return (
        <div className='md:px-20'>
            <h2 className='font-bold text-4xl text-primary text-center'>Create new</h2>

            <div className='mt-10 shadow-md p-10'>
                {/* Select Topic */}
                <SelectTopic onUserSelect={onHandleInputChange}/>
                {/* Select Style */}
                <SelectStyle onUserSelect={onHandleInputChange}/>
                {/* Duration */}
                <SelectDuration onUserSelect={onHandleInputChange}/>
                {/* Create Button */}
                <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
            </div>
            <CustomLoading loading={loading}/>
        </div>
    )
}

export default CreateNew