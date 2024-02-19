import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useTheme } from '@/components/theme-provider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

const ProgramDetails = () => {

  const { theme } = useTheme();
  const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

  const [phaseName, setPhaseName] = useState('')
  const [weeks, setWeeks] = useState('')

  const handlePhaseNameChange = (event) => {
    setPhaseName(event.target.value);
  };
  const handleWeekChange = (value) => {
    setWeeks(value);
  };
  
  function createPhase() {
    const phaseData = {
        program: programId,
        name: phaseName,
        weeks: weeks 
    };

    apiClient.post('/phases/', phaseData) // Pass programData as the payload in the POST request
    .then(response => {
        setPhases(currentPhases => [...currentPhases, response.data]); // Update your state or context with the response
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}
  
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [phases, setPhases] = useState([])

  

  useEffect(() => {
    apiClient.get(`/user_programs/${programId}/`)
      .then(response => setProgram(response.data))
      .catch(error => console.error('Error:', error));
  }, [programId]);

  if (!program) return <div>Loading...</div>;

  return (

    <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full flex flex-col'>
              <div className='p-6 flex flex-col justify-center items-center'>
                <h1 className='text-2xl font-bold'>{program.name}</h1>
                <p className='text-sm text-muted-foreground'>Description: {program.description}</p>
              </div>

              <div className='grid grid-cols-4 gap-4 px-4'>
                {program.phases.map((phase, phaseIndex) => (
                  <div key={phase.id}>
                    <Card>
                    <CardHeader>
                      <CardTitle>{phase.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Duration: {phase.weeks} weeks</p>
                    </CardContent>
                  </Card>
                  </div>
                ))}
              </div>
                <AlertDialog>
                    <AlertDialogTrigger className='mt-4 w-24 ml-4 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                        Add Phase
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Create Phase</AlertDialogTitle>
                        <Label htmlFor="programName">Name</Label><Input value={phaseName} onChange={handlePhaseNameChange} autoComplete="off" id="programName" />
                        <Label htmlFor="select">Weeks</Label>
                        <Select value={weeks} onValueChange={handleWeekChange} id='select'>
                          <SelectTrigger className="w-[80px] focus:ring-0 focus:ring-offset-0">
                              <SelectValue placeholder="weeks" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectGroup>
                                  <SelectLabel>Weeks</SelectLabel>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                  <SelectItem value="6">6</SelectItem>
                                  <SelectItem value="7">7</SelectItem>
                                  <SelectItem value="8">8</SelectItem>
                                  <SelectItem value="9">9</SelectItem>
                                  <SelectItem value="10">10</SelectItem>
                              </SelectGroup>
                          </SelectContent>
                        </Select>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={createPhase}>Create Phase</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </div>
    
  );
};

export default ProgramDetails;