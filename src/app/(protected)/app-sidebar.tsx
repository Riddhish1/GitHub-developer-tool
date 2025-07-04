'use client'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image';

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Q&A",
        url: "/qa",
        icon: Bot
    },
    {
        title: "Meeting",
        url: "/meeting",
        icon: Presentation
    },
    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard
    },
]

const Projects = [
    {
        name: 'Project1'
    },
    {
        name: 'Project2'
    },
    {
        name: 'Project3'
    },
]
export function AppSidebar() {
    const pathname = usePathname();
    const { open } = useSidebar();
    return (
        <Sidebar collapsible='icon' variant='floating'>
            <SidebarHeader>
                <div className='flex items-center gap-2'>
                    <Image src='/logo.png' alt='logo' width={40} height={40} />
                    {
                        open && (
                            <h1 className='text-xl font-bold text-primary/80'>
                                Prayog
                            </h1>
                        )
                    }

                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className={cn({
                                                '!bg-primary !text-white': pathname === item.url
                                            }, 'list-none')}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Projects.map(pp => {
                                return (
                                    <SidebarMenuItem key={pp.name}>
                                        <SidebarMenuButton asChild>
                                            <div>
                                                <div
                                                    className={cn(
                                                        'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                                        {
                                                            'bg-primary text-white': true
                                                        }
                                                    )}
                                                >
                                                    {pp.name[0]}
                                                </div>
                                                <span>{pp.name}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                            <div className='h-2'></div>
                            {open && (
                                <SidebarMenuItem>
                                    <Link href='/create'>
                                        <Button size='sm' variant={'outline'} className='w-fit'>
                                            <Plus />
                                            Create Project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
