"use client"

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/use-store-modal'
import { UserButton } from '@clerk/nextjs'
import { title } from 'process'
import { useEffect } from 'react'

export default function SetupPage() {

  const isOpen = useStoreModal((state) => state.isOpen)
  const onOpen = useStoreModal((state) => state.onOpen);

  useEffect(() => {
    if(!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen])

  return null;
}
