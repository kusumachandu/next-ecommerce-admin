"use client"

import * as z from "zod"
import React, { useState } from 'react'
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Finlandica } from "next/font/google";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard | null;
}



export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Billboard' : 'Create Billboard'
  const description = initialData ? 'Edit A Billboard' : 'Add A New Billboard'
  const toastMessage = initialData ? 'Billboard Updated' : 'Billboard Created'
  const action = initialData ? 'Save Changes' : 'Create'

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  });


  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success('store updated')
    } catch (error) {
      toast.error('something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`api/stores/${params.storeId}`)
      console.log('after await function')
      router.refresh();
      router.push("/");
      toast.success('Store deleted')

    } catch (error) {
      toast.error('Make sure you removed all products and categories first.')
    } finally {
      setLoading(false)
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading 
          title = {title}
          description= {description}
        />
        {
          initialData && 
        <Button
          disabled={loading}
          variant='destructive'
          size='sm'
          onClick={() => setOpen(true)}
        >
          <Trash className='h-4 w-4' />
        </Button>
        }
      </div>
      <Separator className='mt-2 border' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control} 
              name="label" 
              render={({ field }) => {
                return (
                <FormItem>
                  <FormLabel>label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard Label" {...field }/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )
              }}
            />
          </div>
          <Button disabled={loading} className="ml-auto mt-4" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator className="mt-4 mb-4" />
      {/* <ApiAlert title={"NEXT_PUBLIC_API_URL"} description={`${origin}/api/${params.storeId}`} variant={"public"} /> */}
    </>
  )
}
