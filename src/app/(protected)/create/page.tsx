'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { da } from 'date-fns/locale'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

//type is a way to describe what kind of values an object or variable can hold
type FormInput = {
    repoUrl : string
    projectName: string
    githubToken?: string  //The ? in githubToken?: string means it's optional
}

const CreatePage = () => {
 const {register,handleSubmit,reset} = useForm<FormInput>()
 const createProject = api.project.createProject.useMutation()  //useMutation is used to send data (like POST requests)  your frontend and handle loading, success, and error states automatically. 
 
 function onSubmit(data: FormInput){
    createProject.mutate({
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
    },{
        onSuccess: () => {
            toast.success('Project created successfully')
            reset()
        },
        onError: () => {
            toast.error('Failed to create project')
        }
    })
    return true;
 }
  return (
    <div className='flex items-center justify-center h-full min-h-[calc(100vh-6rem)] gap-12'>
        <img src='/man.svg' alt='GitHub repository connection illustration' className='w-96 h-96'/>
        <div>
            <div>
                <h1 className='font-semibold text-2xl'>
                    Link Your GitHub Repository 
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Enter URL of your repository to link it to Prayog
                </p>
            </div>
            <div className='h-4'></div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                    {...register('projectName',{required: true})}
                    placeholder='ProjectName'
                    required
                    />
                    <div className='h-2'></div>
                    <Input 
                    {...register('repoUrl',{required: true})}
                    placeholder='GitHub URL'
                    type='url'
                    required
                    />
                    <div className='h-2'></div>
                    <Input 
                    {...register('githubToken')}
                    placeholder='GitHub Token (Optional)'
                    />
                    <div className='h-4'></div>
                    <Button type='submit' disabled={createProject.isPending}>
                        Create Project
                    </Button>
                </form>
            </div>
        </div>
    </div>
  )

}

export default CreatePage