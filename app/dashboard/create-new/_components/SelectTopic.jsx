"use client"
import React, { useState } from 'react'
import { Textarea } from "../../../../@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../@/components/ui/select"

function SelectTopic({ onUserSelect }) {
    const options = ['Custom Prompt', 'AI Random Prompt', 'Scary Story', 'Historical Story', 'Bed Time Story', 'Motivational Story', 'Fun Facts']

    const [selectedOption, setSelectedOption] = useState('');

    return (
        <div>
            <h2 className='font-bold text-2xl text-primary'>Content</h2>
            <p className='text-gray-500'>What is the topic of your video?</p>

            <Select onValueChange={(value) => {
                setSelectedOption(value);
                value !== 'Custom Prompt' && onUserSelect('topic', value);
            }}>
                <SelectTrigger className="w-full mt-2 p-6 text-lg bg-white border border-gray-300 rounded-lg shadow-sm hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                    {options.map((item, index) => (
                        <SelectItem
                            key={index}
                            value={item}
                            className="text-lg p-3 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedOption === 'Custom Prompt' &&
                <Textarea
                    className="mt-3 p-4 text-lg bg-white border border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-2 focus:ring-primary"
                    onChange={(e) => onUserSelect('topic', e.target.value)}
                    placeholder='Write your prompt on which you want to generate video'
                />
            }
        </div>
    )
}

export default SelectTopic