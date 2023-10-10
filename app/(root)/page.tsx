"use client"

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { UserButton } from '@clerk/nextjs'
import { title } from 'process'

export default function SetupPage() {
  return (
    <div className='p-4'>
      <UserButton afterSignOutUrl='/' />
      <div>
        <Modal isOpen onClose={() => {}} title='title' description='first test case'>
          children
        </Modal>
      </div>
    </div>
  )
}
