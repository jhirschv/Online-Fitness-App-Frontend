import React from 'react'
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { Calendar } from "@/components/ui/calendar"
  import { Button } from "@/components/ui/button"
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
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
      } from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const Train = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    function startTrainingSession() {
        navigate('/workoutSession')
    }


    const [date, setDate] = React.useState(new Date())
    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`${backgroundColorClass} w-full p-4 border rounded-lg`}>
            <Card className='h-full w-full flex flex-col'>
                <div className='flex h-full'>

                    <div className='flex flex-col h-full justify-between basis-2/5 pl-6'>
                        <div className='flex flex-col pr-2 py-6'>
                            <div className='flex mb-4'>
                                <h1 className='mr-2 text-2xl font-semibold'>12 Week Undulating</h1>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline">Change Program</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                        <SheetTitle>Select Program</SheetTitle>
                                        </SheetHeader>
                                        <div className='p-4'>
                                            <h1>12 Week Linear</h1>
                                        </div>
                                        <Separator></Separator>
                                        <div className='p-4'>
                                            <h1>8 Week Hypertrophy</h1>                                  
                                        </div>
                                        <Separator></Separator>
                                        <div className='p-4'>
                                            <h1>16 Week Linear</h1>                                   
                                        </div>
                                        <Separator></Separator>
                                        <div className='p-4'>
                                            <h1>McKays Program</h1>                                  
                                        </div>
                                        <Separator></Separator>
                                        <SheetFooter className='mt-4'>
                                        <SheetClose asChild>
                                            <Button type="submit">Save changes</Button>
                                        </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>
                            
                            
                            <div className='flex items-center justify-between pr-2'>
                                <h1 className='font-semibold text-lg'>Lower Body 1</h1>
                                <div className=''>
                                    <Popover>
                                        <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                        <PopoverContent>Place content for the popover here.</PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        
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
                        
                        <div className='mb-6'>
                            <Button onClick={startTrainingSession} className='self-center w-1/2 p-6 text-lg'>Start Training!</Button>
                            <Button variant='outline' className='mx-2 self-center w-1/3 mb-4 p-6 text-lg'>Skip Workout</Button>
                        </div>
                        
                    </div>

                    <div className='flex h-full items-center justify-center basis-3/5'>
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="h-[90%] m-4"
                        />
                    </div>
                    

                    
                    
                </div>
            </Card>
        </div>
    )
}

export default Train