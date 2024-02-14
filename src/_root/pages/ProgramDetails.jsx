import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useTheme } from '@/components/theme-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ProgramDetails = () => {

  const { theme } = useTheme();
  const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

  const { programId } = useParams();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    apiClient.get(`/user_programs/${programId}/`)
      .then(response => setProgram(response.data))
      .catch(error => console.error('Error:', error));
  }, [programId]);

  if (!program) return <div>Loading...</div>;

  return (

    <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full flex flex-col items-center'>
              <div className='mt-12'>
                <h1 className='text-xl font-bold'>{program.name}</h1>
                <p className='text-sm text-muted-foreground'>Description: {program.description}</p>
                {program.phases.map((phase, phaseIndex) => (
                  <div key={phase.id}>
                    <h3 className='text-lg font-bold'>Phase {phase.number}: {phase.weeks} weeks</h3>
                    {phase.workouts.map((workout, workoutIndex) => (
                      <div key={workout.id}>
                        <h4>Workout {workoutIndex + 1}: {workout.name}</h4>
                        <ul>
                          {workout.workout_exercises.map((we, weIndex) => (
                            <li key={we.id}>
                              {we.exercise.name} - Sets: {we.sets}, Reps: {we.reps}{we.note ? `, Note: ${we.note}` : ''}{we.video ? `, Video: ${we.video}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
        </div>
    
  );
};

export default ProgramDetails;