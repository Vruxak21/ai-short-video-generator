import React from 'react'
import { Button } from '../../../components/ui/button'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

function Header() {
    return (
      <div className='p-3 px-5 flex items-center justify-between shadow-md'>
        <div className='flex gap-3 items-center'>
          <Image src={'/logo.png'} width={30} height={30}/>
          <h2 className='font-bold text-xl'>AI Short Video</h2>
        </div>
        <div className='flex gap-3 items-center'>
          <Button>Dashboard</Button>
          <UserButton/>
        </div>
      </div>
    )
}

export default Header
