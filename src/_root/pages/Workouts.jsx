
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
import { useNavigate } from 'react-router-dom';

const Workouts = () => {
    const { theme } = useTheme();

    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full'>
                <div>
                    <div className='flex justify-between items-center'>
                        <div className='px-6 pt-6 pb-2'>
                            <h1 className='text-2xl font-semibold '>Workouts</h1>
                            <p className='text-sm text-muted-foreground'>Create workouts here</p>
                        </div>
                    
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild className='mr-4'>
                         <Button variant="outline" className='flex gap-1 items-center'><FontAwesomeIcon size='sm'icon={faPlus} />Create New Workout</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Program</AlertDialogTitle>
                            <Label htmlFor="programName">Name</Label><Input autoComplete="off" id="programName" />
                            <Label htmlFor="description">Description</Label><Input autoComplete="off" id="description" />
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                    <div className='flex flex-col w-full px-4 pb-4'>
                        <div className='flex items-center justify-end pb-2 space-x-2 w-full'>
                            <Label htmlFor="sort">Sort by:</Label>

                            <Select className='self-end focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0' id='sort'>
                                <SelectTrigger className="w-[180px]">
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
                        
                        </TableBody>
                    </Table>
                    </div>

                    </div>
                </div>
                
            </Card>
        </div>
    )
}

export default Workouts