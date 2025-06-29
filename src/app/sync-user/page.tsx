import { auth,clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import { db } from '@/server/db';

const SyncUser = async () => {
    const {userId} = await auth();
    if(!userId){
        throw new Error("User not found")
    }
    const client =await clerkClient() //client is the one using my application
    const user = await client.users.getUser(userId); //fetching user with its userid returns something like {id: , email: [] ,name: }
    if(!user.emailAddresses[0]?.emailAddress){
        return notFound()
    }

    //db is our prisma and upsert is if uer dne create it if exists update info
    await db.user.upsert({
        where:{
            email: user.emailAddresses[0]?.emailAddress ?? ""
        },
        update: {
            imageUrl: user.imageUrl,
            firstName: user.firstName ?? "", //?? is nullish operator so if our firstname is null use what is after ?? that is ""
            lastName: user.lastName ?? "",
        },
        create:{
            email: user.emailAddresses[0]?.emailAddress ?? "",
            imageUrl: user.imageUrl,
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
        }
    })
return redirect('/dashboard')}

export default SyncUser;