import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
            <div className='flex w-full px-6 h-24'>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Accumulation</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Intensificaition</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Accumulation</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center flex-1 border bg-primary'><p className='text-xl font-semibold'>Intensificaition</p><p className='text-sm'>4 Weeks</p></div>
                <div className='flex flex-col justify-center items-center w-24 text-xs'><FontAwesomeIcon className='mb-1 text-muted-foreground' icon={faCirclePlus} size="2xl" /><p className='text-muted-foreground'>Add Phase</p></div>
            </div>
            <div className='flex flex-col w-[97%] h-40 flex-grow border my-4 rounded-lg'>
                <div className='flex w-full justify-center'>
                    <h1 className='border-b h-12 w-full text-center text-xl font-semibold mt-4'>Accumulation</h1>
                </div>
                <div className='flex h-full'>
                    <div className='font-semibold flex-1 flex justify-between border text-md text-center p-4'>Day 1 Overview<FontAwesomeIcon onClick={handleProgramClick}  icon={faPenToSquare}/></div>
                    <div className='font-semibold flex-1 flex justify-between border text-md text-center p-4'>Day 2 Overview<FontAwesomeIcon onClick={handleProgramClick} icon={faPenToSquare} /></div>
                    <div className='font-semibold flex-1 flex justify-between border text-md text-center p-4'>Add Workout +<FontAwesomeIcon onClick={handleProgramClick} icon={faPenToSquare} /></div>
                </div>
            </div>
        </Card>
    </div>
  )
}

export default ProgramOverview