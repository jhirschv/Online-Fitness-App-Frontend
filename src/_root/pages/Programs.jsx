import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
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
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator"
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
import { faEllipsis, faPlus} from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button"
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';


export default function YourWorkouts() {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");

    const handleNameInputChange = (event) => {
    setProgramName(event.target.value); // Update state with input value
        };
    const handleDescriptionInputChange = (event) => {
        setProgramDescription(event.target.value); // Update state with input value
        };
    const resetForm = () => {
        setProgramName('');
        setProgramDescription('');
        };

    function createProgram() {
        const programData = {
            name: programName, // Assuming your API expects a key called 'name'
            description: programDescription, // Assuming your API expects a key called 'description'
        };
    
        apiClient.post('/programs/', programData) // Pass programData as the payload in the POST request
        .then(response => {
            setPrograms(currentPrograms => [...currentPrograms, response.data]); // Update your state or context with the response
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    function deleteProgram(programId) {
        apiClient.delete(`/programs/${programId}/`) // Use the DELETE method to request program deletion
        .then(() => {
            setPrograms(currentPrograms => currentPrograms.filter(program => program.id !== programId)); // Remove the deleted program from the state
        })
        .catch(error => {
            console.error('Error deleting the program:', error);
        });
    }
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        apiClient.get('/user_programs/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setPrograms(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const navigate = useNavigate();
    const handleProgramClick = (programId) => {
        navigate(`/program_overview/${programId}/`); // Navigate to program details page
    };

    return (

        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full'>
                <div>
                    <div className='flex justify-between items-center'>
                        <div className='px-6 pt-6 pb-2'>
                            <h1 className='text-2xl font-semibold '>Programs</h1>
                            <p className='hidden md:block text-sm text-muted-foreground'>Create, customize, and share programs here</p>
                        </div>
                    
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild className='mr-4'>
                         <Button variant="outline" className='flex gap-1 items-center'><FontAwesomeIcon size='sm' icon={faPlus} />New Program</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Program</AlertDialogTitle>
                            <Label htmlFor="programName">Name</Label><Input onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                            <Label htmlFor="description">Description</Label><Input onChange={handleDescriptionInputChange} value={programDescription} autoComplete="off" id="description" />
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={createProgram}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                    <div className='flex flex-col w-full px-4 pb-4'>
                        <div className='flex items-center justify-end pb-2 space-x-2 w-full'>
                            <Label className='hidden md:block' htmlFor="sort">Sort by:</Label>

                            <Select className='self-end focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0' id='sort'>
                                <SelectTrigger className="w-[160px] p-3">
                                    <SelectValue placeholder="Recently Updated" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recentlyUpdated">Recently Updated</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Descritpion</TableHead>
                            <TableHead>Creator</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {programs.map((program) => (
                            <TableRow key={program.id} className='relative' onClick={() => handleProgramClick(program.id)}>
                             
                            <TableCell key={program.name}>{program.name}</TableCell>
                            <TableCell className="font-medium p-6">{program.description}</TableCell>
                            <TableCell>{program.creator.username[0].toUpperCase() + program.creator.username.slice(1)}
                            <div className='hidden md:block absolute top-0 right-4' onClick={(event) => event.stopPropagation()}>
                                <Popover>
                                    <PopoverTrigger className='p-4'><FontAwesomeIcon size='lg' icon={faEllipsis} /></PopoverTrigger>
                                    <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md' >
                                        <Button onClick={() => deleteProgram(program.id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Program</Button></PopoverContent>
                                </Popover>
                            </div> 
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </div>

                    </div>
                </div>
                
            </Card>
        </div>
        
        
    )
 
}
