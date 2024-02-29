import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock} from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/components/theme-provider';
  

const WorkoutSession = () => {


    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';


    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full'>
                <div className='flex relative w-full items-center justify-center p-4'>
                    <FontAwesomeIcon className='absolute top-6 left-6' onClick={goBack} size="xl" icon={faAngleLeft} />
                    <h1 className='text-xl font-semibold'>May 3, 2024: Lower Body 1</h1>
                </div>
                <div className='w-full flex flex-col justify-center items-center'>
                    
                    <Carousel className="w-[1100px] h-[550px]">
                        <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}  >
                                <div className="p-1">
                                <Card className='h-[550px]' >
                                    <CardContent className="flex h-full items-center justify-center p-6 ">
                                        <div className='flex flex-col'>
                                            <div className='flex items-center'>
                                                <h1>1. Back Squat</h1>
                                                <Button variant='outline' className='ml-2'>History</Button>
                                            </div>
                                            
                                            <div className='flex items-center m-2'>
                                                <p>Set 1: Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <div className='flex items-center m-2'>
                                                <p>Set 2: Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <div className='flex items-center m-2'>
                                                <p>Set 3: Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <div className='flex items-center m-2'>
                                                <p>Set 4: Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <div className='flex gap-1 items-center' > 
                                                <Drawer>
                                                    <DrawerTrigger asChild><Button size='lg' variant='outline'><FontAwesomeIcon size='lg' icon={faClock} /></Button></DrawerTrigger>
                                                    <DrawerContent>
                                                        <div className="h-[300px] flex flex-col">
                                                        <DrawerFooter>
                                                        <DrawerClose className='mb-4 self-bottom'> 
                                                            <Button variant="outline">Cancel</Button>
                                                        </DrawerClose>
                                                        </DrawerFooter>
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                                <Button size='lg' variant='outline'>Save</Button>
                                            </div>
                                        </div>
                                        
                                        
                                    </CardContent>
                                </Card>
                                </div>
                            </CarouselItem>
                            ))}
                            <CarouselItem className='basis-full h-full'>
                                <div className="p-1">
                                    <Card className='h-[550px]'>
                                        <CardContent className="flex flex-col h-full items-center justify-center p-6 gap-2">
                                                <h1 className='text-xl font-semibold'>Workout Finished!</h1>
                                                <Button onClick={goBack}>End Workout</Button>

                                        </CardContent>
                                    </Card>
                                </div>
                                
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>           
                </div>
            </Card>
        </div>
        
        
        
    )
}

export default WorkoutSession