import { UserButton } from '@clerk/nextjs'
import { FC } from 'react'

interface NavbarProps {
  
}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <div>
          This will be store switcher
        </div>
        <div>
          this will be the routes
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </div>
  )
}

export default Navbar