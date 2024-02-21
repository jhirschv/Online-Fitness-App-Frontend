import React from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCirclePlus, faPlus, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import { faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const ProgramOverview = () => {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const navigate = useNavigate();
    const handleProgramClick = (programId) => {
        navigate(`/create/`); // Navigate to program details page
    };

    return (
    <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
        <Card className='h-full w-full flex flex-col'>
            <div className='p-6 flex justify-between items-center'>
                <div className='flex'>
                    <h1 className='text-2xl font-semibold'>16 Week Strength Program</h1>
                    <Badge variant='secondary' className='ml-4 text-xs'>Active</Badge>
                </div>
                <Button variant='outline'>Assign Clients</Button>
            </div>
            <div className='flex flex-col'>
                <div className='flex w-full px-6 h-20'>
                    <div className='flex flex-col justify-center items-center flex-1 border bg-primary hover:bg-primary-darker'><p className='text-xl font-semibold'>Accumulation 1</p><p className='text-sm'>4 Weeks</p></div>
                    <div className='flex flex-col justify-center items-center flex-1 border bg-primary hover:bg-primary-darker'><p className='text-xl font-semibold'>Intensificaition 1</p><p className='text-sm'>4 Weeks</p></div>
                    <div className='flex flex-col justify-center items-center flex-1 border bg-primary hover:bg-primary-darker'><p className='text-xl font-semibold'>Accumulation 2</p><p className='text-sm'>4 Weeks</p></div>
                    <div className='flex flex-col justify-center items-center flex-1 border bg-primary hover:bg-primary-darker'><p className='text-xl font-semibold'>Intensificaition 2</p><p className='text-sm'>4 Weeks</p></div>
                    <div className='flex flex-col justify-center items-center w-24 text-xs'><FontAwesomeIcon className='mb-1 text-muted-foreground' icon={faCirclePlus} size="2xl" /><p className='text-muted-foreground'>Add Phase</p></div>
                </div>
                
            </div>
            <div className='w-full px-6 pt-4'>
                <Card className='px-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='p-4 text-xl font-semibold'>Accumulation 1</h1>
                        <Button variant='outline'>
                            <FontAwesomeIcon className='mr-1' icon={faPlus} /> Add Workout
                        </Button>
                       
                    </div>
                    
                    <Tabs defaultValue="1" className="w-full rounded-sm">
                        <div className='flex items-center'>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="1">Lower Body 1</TabsTrigger>
                                <TabsTrigger value="2">Upper Body 1</TabsTrigger>
                                <TabsTrigger value="3">Lower Body 2</TabsTrigger>
                                <TabsTrigger value="4">Upper Body 2</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="1">
                            <Card  className='border-none h-80'>
                            <CardContent className="space-y-2">
                            <Table className='h-full'>
                                <TableHeader>
                                <TableRow className='relative'>
                                    <TableHead className="w-[100px]">Exercise</TableHead>
                                    <TableHead>Sets x Reps</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead onClick={handleProgramClick} className='absolute right-0 pb-0.5 flex items-center'><p className='mr-2'>Edit Workout</p><FontAwesomeIcon size="lg" icon={faPenToSquare} /></TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Back Squat</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                        <TableCell>Build up to a heavy top set</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-48">Romanian Deadlift</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Split Squat</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                        <TableCell>Focus on Form</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Calf Raise</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            </CardContent>
                            <CardFooter>
                                
                            </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="2">
                            <Card className='border-none h-80'>
                            <CardContent className="space-y-2">
                            <Table className='h-full'>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Exercise</TableHead>
                                    <TableHead>Sets x Reps</TableHead>
                                    <TableHead>Note</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody onClick={handleProgramClick}>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Back Squat</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                        <TableCell>Build up to a heavy top set</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-48">Romanian Deadlift</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Split Squat</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                        <TableCell>Focus on Form</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Calf Raise</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            </CardContent>
                            <CardFooter>
                                
                            </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="3">
                            <Card className='border-none h-80'>
                            <CardContent className="space-y-2">
                            <Table className='h-full'>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Exercise</TableHead>
                                <TableHead>Sets x Reps</TableHead>
                                <TableHead>Note</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody onClick={handleProgramClick}>
                                <TableRow>
                                    <TableCell className="font-medium w-36">Back Squat</TableCell>
                                    <TableCell>5 x 5</TableCell>
                                    <TableCell>Build up to a heavy top set</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium w-48">Romanian Deadlift</TableCell>
                                    <TableCell>5 x 5</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium w-36">Split Squat</TableCell>
                                    <TableCell>3 x 8</TableCell>
                                    <TableCell>Focus on Form</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium w-36">Calf Raise</TableCell>
                                    <TableCell>3 x 8</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                            </CardContent>
                            <CardFooter>
                                
                            </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="4">
                            <Card className='border-none h-80'>
                            <CardContent className="space-y-2">
                            <Table className='h-full'>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Exercise</TableHead>
                                    <TableHead>Sets x Reps</TableHead>
                                    <TableHead>Note</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody onClick={handleProgramClick}>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Back Squat</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                        <TableCell>Build up to a heavy top set</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-48">Romanian Deadlift</TableCell>
                                        <TableCell>5 x 5</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Split Squat</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                        <TableCell>Focus on Form</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium w-36">Calf Raise</TableCell>
                                        <TableCell>3 x 8</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            </CardContent>
                            <CardFooter>
                                
                            </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </Card>
            
            </div>
            
        </Card>
    </div>
  )
}

export default ProgramOverview













{/* <div className='grid grid-cols-2 gap-4 px-4'>
                <div className='flex my-4 flex-col w-full h-96 flex-grow border rounded-lg'>
                <h1 className='pt-4 pb-1 text-2xl font-semibold text-center'>Phase Details</h1>
                <h1 className='text-lg font-semibold text-center text-muted-foreground'>Accumulation</h1>
                <Table className='h-full'>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Day</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Edit</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody onClick={handleProgramClick}>
                        <TableRow>
                            <TableCell className="font-medium">1</TableCell>
                            <TableCell>Upper Body 1</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">2</TableCell>
                            <TableCell>Lower Body 2</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">3</TableCell>
                            <TableCell>Upper Body 2</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">4</TableCell>
                            <TableCell>Lower Body 2</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
                <div className='flex my-4 flex-col w-full h-96 flex-grow border rounded-lg'>
                <h1 className='pt-4 pb-1 text-2xl font-semibold text-center'>Workout Details</h1>
                <h1 className='text-lg font-semibold text-center text-muted-foreground'>Lower Body 1</h1>
                <Table className='h-full'>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Exercise</TableHead>
                        <TableHead>Sets x Reps</TableHead>
                        <TableHead>Note</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody onClick={handleProgramClick}>
                        <TableRow>
                            <TableCell className="font-medium w-36">Back Squat</TableCell>
                            <TableCell>5 x 5</TableCell>
                            <TableCell>Build up to a heavy top set</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium w-48">Romanian Deadlift</TableCell>
                            <TableCell>5 x 5</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium w-36">Split Squat</TableCell>
                            <TableCell>3 x 8</TableCell>
                            <TableCell>Focus on Form</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium w-36">Calf Raise</TableCell>
                            <TableCell>3 x 8</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
            </div> */}