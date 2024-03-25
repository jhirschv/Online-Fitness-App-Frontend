import React from 'react'
import { useTheme } from '@/components/theme-provider';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Separator } from '@/components/ui/separator';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const Account = () => {
    const { theme } = useTheme();

    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full ${backgroundColorClass} md:border rounded-lg md:p-4`}>
            <Card className='h-full w-full rounded-none md:rounded-lg'>
                    <div className='p-6 flex justify-between items-center'>
                        <div className='w-full'>
                            <h1 className='text-2xl font-semibold '>Account</h1>
                            <p className='text-sm text-muted-foreground'>Manage your account settings here</p>
                            <Separator className="my-6"/>
                            <div className='flex flex-col gap-6'>

                                <div className='flex items-center gap-8'>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col justify-center font-semibold text-sm'>
                                        <p>John</p>
                                        <p className='text-primary underline-offset-4 hover:underline'>Change profile photo</p>
                                    </div>

                                </div>

                                <div>
                                    <Label>Username</Label>
                                    <Input className='md:w-96 rounded-xs mt-1' placeholder="Username"></Input>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input className='md:w-96 rounded-xs mt-1' placeholder="Email"></Input>
                                </div>
                                
                                
                                <div className='flex gap-2'>
                                    <Button className='rounded-xs w-30 '>Update Account</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className='rounded-xs w-30 h-[41px]' variant="outline">Delete Account</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your
                                                account and remove your data from our servers.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            
                        </div>
                    </div>
            
            </Card>
        </div>
    )
}

export default Account