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
        <div className={`${backgroundColorClass} w-full px-4 pt-4 border rounded-lg`}>
            <Card className='flex h-auto'>
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="flex-1 h-[95%] m-4"
                />
                <div className='flex flex-col flex-1 border-l pl-4'>
                    <div className='flex items-center justify-between pr-2 py-4'>
                        <h1 className='text-center text-xl font-semibold'>12 Week Undulating</h1>
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
                        <h1 className='font-semibold text-lg'>Week 3: Lower 1</h1>
                        <Button variant='outline'>All Sessions</Button>
                    </div>
                    
                    <Table className='h-full'>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Exercise</TableHead>
                        <TableHead>Sets x Reps</TableHead>
                        <TableHead>Note</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody >
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
                 
                <div className='mt-4'>
                    <Button onClick={startTrainingSession} className='self-center w-1/2 p-6 text-lg'>Start Training!</Button>
                    <Button variant='outline' className='mx-2 self-center w-1/3 mb-4 p-6 text-lg'>Skip Workout</Button>
                </div>
                
                </div>
                
            </Card>
        </div>
    )
}

export default Train