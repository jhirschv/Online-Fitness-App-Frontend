import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useTheme } from '@/components/theme-provider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis} from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button"

const ProgramDetails = () => {
  const { theme } = useTheme();
  const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
  const navigate = useNavigate();

  const { phaseId } = useParams();
  const [phase, setPhase] = useState(null);


  useEffect(() => {
    apiClient.get(`/phases/${phaseId}/`)
      .then(response => setPhase(response.data))
      .catch(error => console.error('Error:', error));
  }, [phaseId]);

  function handlePhaseClick(workoutId) {
    navigate(`/workout/${workoutId}`);
  }

  if (!phase) return <div>Loading...</div>;

  return (

    <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full flex flex-col'>
              <div className='p-6 flex flex-col justify-center items-center'>
                <h1 className='text-2xl font-bold'>{phase.name}</h1>
              </div>

              <div className='grid grid-cols-4 gap-4 px-4'>
                {phase.workouts.map((workout, phaseIndex) => (
                  <div key={workout.id}>
                    <Card onClick={() => handlePhaseClick(workout.id)}>
                    <CardHeader className='relative'>
                      <CardTitle>{workout.name}</CardTitle>
                      <div className='absolute top-0 right-0'>
                          <Popover>
                              <PopoverTrigger className='px-2 pb-2'><FontAwesomeIcon size='lg' icon={faEllipsis} /></PopoverTrigger>
                              <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md' >
                                  <Button className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Workout</Button></PopoverContent>
                          </Popover>
                      </div> 
                    </CardHeader>
                  </Card>
                  </div>
                ))}
              </div>
            </Card>
        </div>
    
  );
};

export default ProgramDetails;