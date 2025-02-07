import React from 'react'
import { Button } from '../../../components/ui/button'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

function Header() {
    return (
      <div className='p-3 px-5 flex items-center justify-between shadow-md'>
        <Link href="/dashboard">
        <div className='flex gap-3 items-center'>
          <Image src={'/logo.png'} width={30} height={30} alt='logo'/>
          <h2 className='font-bold text-xl'>Vizio AI</h2>
        </div>
        </Link>
        <div className='flex gap-3 items-center'>
          <Button>Dashboard</Button>
          <UserButton/>
        </div>
      </div>
    )
}

export default Header
