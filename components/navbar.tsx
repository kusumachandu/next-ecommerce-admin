import { UserButton } from '@clerk/nextjs'
import { FC } from 'react'
import { MainNav } from '@/components/main-nav'
import { StoreSwitcher } from '@/components/store-switcher'

interface NavbarProps {
  
}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <div>
          <StoreSwitcher className='' items={[]} />
        </div>
        <MainNav className='ml-4' />
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </div>
  )
}

export default Navbar