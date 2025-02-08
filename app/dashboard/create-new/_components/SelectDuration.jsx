"use client"
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../@/components/ui/select";

function SelectDuration({ onUserSelect }) {
    return (
        <div className='mt-7'>
            <h2 className='font-bold text-2xl text-primary'>Duration</h2>
            <p className='text-gray-500'>Select the duration of your video</p>

            <Select onValueChange={(value) => {
                value !== 'Custom Prompt' && onUserSelect('duration', value);
            }}>
                <SelectTrigger className="w-full mt-2 p-6 text-lg bg-white border border-gray-300 rounded-lg shadow-sm hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                <SelectItem
                        value="15 Seconds"
                        className="text-lg p-3 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                        15 Seconds
                    </SelectItem>
                    <SelectItem
                        value="30 Seconds"
                        className="text-lg p-3 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                        30 Seconds
                    </SelectItem>
                    <SelectItem
                        value="60 Seconds"
                        className="text-lg p-3 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                        60 Seconds
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export default SelectDuration;