import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Sync = async () => {
    const {userId} = await auth();
    if(!userId){
        throw new Error("User not found")
    }
    const client =await clerkClient()
    const 
    return(
        <div>

        </div>
    )
}