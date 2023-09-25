import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

export default function SetupPage() {
  return (
    <div className='p-4'>
      <UserButton afterSignOutUrl='/' />
    </div>
  )
}
