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

const Train = () => {
    const { theme } = useTheme();

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
                    <h1 className='pt-4 pb-1 text-center text-2xl font-semibold'>Current Workout</h1>
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
                
                <Accordion className='' type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Previous Workouts</AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className='h-32'>
                            <p className='p-4'>Upper Body</p>
                            <Separator/>
                            <p className='p-4'>Lower Body</p>
                            <Separator/>
                            <p className='p-4'>Upper Body</p>
                            <Separator/>
                            <p className='p-4'>Lower Body</p>
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Upcoming Workouts</AccordionTrigger>
                        <AccordionContent >
                        <ScrollArea className='h-32'>
                            <p className='p-4'>Upper Body</p>
                            <Separator/>
                            <p className='p-4'>Lower Body</p>
                            <Separator/>
                            <p className='p-4'>Upper Body</p>
                            <Separator/>
                            <p className='p-4'>Lower Body</p>
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button className='mt-auto self-center w-1/2 mb-4 p-6 text-lg'>Start Training!</Button>
                </div>
                
            </Card>
        </div>
    )
}

export default Train