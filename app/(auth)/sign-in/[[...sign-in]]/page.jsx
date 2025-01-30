import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
export default function Page() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div>
        <Image src={'/login.webp'} alt='login' width={545} height={600}/>
      </div>
      <div className='flex justify-center items-center h-screen'>
        <SignIn/>
      </div>
    </div>
  )
}