"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../../@/components/ui/button'
import EmptyState from './_components/EmptyState'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { VideoData } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import VideoList from '@/app/dashboard/_components/VideoList'

const Dashboard = () => {
    const { user } = useUser();
    const [videoList, setVideoList] = useState([]);

    useEffect(() => {
        if (user) {
            GetVideoList();
        }
    }, [user]);

    const GetVideoList = async () => {
        try {
            const result = await db
                .select()
                .from(VideoData)
                .where(eq(VideoData.createdBy, user?.id));
            console.log("Fetched Videos:", result);
            setVideoList(result);
        } catch (error) {
            console.error("Error fetching video list:", error);
        }
    };

    return (
        <div>
            <div className='justify-between flex items-center'>
                <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
                {videoList.length === 0 && (
                    <Link href={'/dashboard/create-new'}>
                        <Button>+ Create New</Button>
                    </Link>
                )}
            </div>
            {videoList.length === 0 ? <EmptyState /> : <VideoList videoList={videoList} />}
        </div>
    );
};

export default Dashboard;