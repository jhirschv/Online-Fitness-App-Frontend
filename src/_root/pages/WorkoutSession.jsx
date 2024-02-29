import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableFooter,
    TableRow,
    } from "@/components/ui/table"
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
import { faAngleLeft, faEllipsis} from '@fortawesome/free-solid-svg-icons';
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
                <div className='flex relative w-full items-center justify-center p-6'>
                    <FontAwesomeIcon className='absolute top-6 left-6' onClick={goBack} size="xl" icon={faAngleLeft} />
                    <h1 className='text-2xl font-semibold'>May 3, 2024: Lower Body 1</h1>
                </div>
                <div className='w-full flex'>
                    
                    <Carousel className="w-full md:w-1/2 md:mx-16 max-w-2xl">
                        <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}   >
                                <div >
                                <Card className='h-[550px]' >
                                    <CardContent className="flex p-6 ">
                                        <div className='flex flex-col'>
                                            <div className='flex items-center pb-4'>
                                                <h1 className='font-semibold text-xl'>1. Back Squat</h1>
                                                <Button variant='outline' className='ml-2'>History</Button>
                                            </div>
                                            <Separator/>
                                            <div className='flex items-center m-2 py-2'>
                                                <p>1. Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <Separator/>
                                            <div className='flex items-center m-2 py-2'>
                                                <p>2. Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <Separator/>
                                            <div className='flex items-center m-2 py-2'>
                                                <p>3. Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <Separator/>
                                            <div className='flex items-center m-2 py-2'>
                                                <p>4. Reps</p><Label htmlFor="reps" className='mr-2'></Label><Input id='reps' className='w-20 mr-2'></Input>
                                                <Label htmlFor="weight" className='mr-2'>Weight</Label><Input id='weight' className='w-20'></Input>
                                                <Button variant='outline' className='mx-2'>Add Note</Button>
                                                <Button variant='outline'>Add Video</Button>
                                            </div>
                                            <Separator/>
                                            
                                            <div className='flex gap-1 items-center pt-4' > 
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
                        <CarouselPrevious className='hidden md:block'/>
                        <CarouselNext className='hidden md:block'/>
                    </Carousel>    
                    <Card className='hidden md:block h-[550px] flex-1 mr-6 p-6'>
                        <div className='flex items-center justify-between pr-2'>
                            <h1 className='font-semibold text-lg'>Lower Body 1</h1>
                            <div className=''>
                                <Popover>
                                    <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                    <PopoverContent>Place content for the popover here.</PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div>
                            <Table className='h-full'>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] pl-0">Exercise</TableHead>
                                    <TableHead>Sets x Reps</TableHead>
                                    <TableHead>Note</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody >
                                    <TableRow>
                                        <TableCell className="font-medium w-36 pl-0">Back Squat</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                        <TableCell>Build up to a heavy top set</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-48 pl-0">Romanian Deadlift</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36 pl-0">Split Squat</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                        <TableCell>Focus on Form</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36 pl-0">Calf Raise</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </Card>       
                </div>
            </Card>
        </div>
        
        
        
    )
}

export default WorkoutSession