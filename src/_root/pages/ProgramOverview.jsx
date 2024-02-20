import React from 'react'
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
import { faPenToSquare, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';

const ProgramOverview = () => {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const navigate = useNavigate();
    const handleProgramClick = (programId) => {
        navigate(`/create/`); // Navigate to program details page
    };

    return (
    <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
        <Card className='h-full w-full flex flex-col items-center'>
            <h1 className='p-6 text-2xl font-semibold'>16 Week Strength Program</h1>
            <div className='flex w-full px-6 h-28'>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Accumulation</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Intensificaition</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Accumulation</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Intensificaition</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center w-24 text-xs'><FontAwesomeIcon className='mb-1 text-muted-foreground' icon={faCirclePlus} size="2xl" /><p className='text-muted-foreground'>Add Phase</p></div>
            </div>
            <div className='flexp my-4 flex-col w-[97%] h-40 flex-grow border rounded-lg'>
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
                        <TableCell>Upper Body</TableCell>
                        <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">2</TableCell>
                        <TableCell>Lower Body</TableCell>
                        <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">3</TableCell>
                        <TableCell>Upper Body</TableCell>
                        <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">4</TableCell>
                        <TableCell>Lower Body</TableCell>
                        <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </div>
        </Card>
    </div>
  )
}

export default ProgramOverview