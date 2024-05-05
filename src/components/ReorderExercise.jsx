import * as React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { ReorderIcon } from "./Icon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faChevronRight, faGripVertical, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button"
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"
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
Drawer,
DrawerClose,
DrawerContent,
DrawerDescription,
DrawerFooter,
DrawerHeader,
DrawerTitle,
DrawerTrigger,
} from "@/components/ui/drawer"
import {
Select,
SelectContent,
SelectItem,
SelectGroup,
SelectLabel,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

export const ReorderExercise = ({ handleEditSetsChange, handleEditRepsChange, isDragging, setIsDragging, onPointerDown, onPointerUp, onPointerCancel, workout_exercise, index, deleteWorkoutExercise, updateWorkout}) => {
  const dragControls = useDragControls();
  const onDragStart = (event) => {
    event.stopPropagation();
    onPointerDown();
    dragControls.start(event); 
    setIsDragging(true); 
  
  };

  const handleOnPointerUp = () => {
    // Delay resetting isDragging to allow onClick to check its value
    setTimeout(() => {
      setIsDragging(false);
    }, 100); // Short delay to differentiate between drag end and click
    onPointerUp && onPointerUp(); // Call any additional logic provided by onPointerUp
  };

  return (
    <Reorder.Item onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} dragControls={dragControls} 
    id={workout_exercise} key={workout_exercise.id} value={workout_exercise} dragListener={false} className='py-6 my-2 pl-8 pr-10 w-full flex justify-between items-center border rounded-xs relative h-20 overflow-hidden'>
        <div  onPointerDown={onDragStart} onPointerUp={handleOnPointerUp} className='pr-4 pl-2 py-4 absolute top-4 left-0 text-border'>
            <FontAwesomeIcon size='lg' icon={faGripVertical} />
        </div>
        <div className='w-1/2 font-semibold '>{index + 1}. {workout_exercise.exercise.name}</div>
            <div className='font-semibold'>{workout_exercise.sets} x {workout_exercise.reps}</div>
            {workout_exercise.exercise.video ? (
                <div className='h-14 w-14'>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <img
                                src={`https://img.youtube.com/vi/${workout_exercise.exercise.video}/maxresdefault.jpg`}
                                alt="Video Thumbnail"
                                className="object-cover rounded-full cursor-pointer w-14 h-14"
                            />
                        </AlertDialogTrigger>
                        <AlertDialogContent className='gap-0'>
                            <div className="aspect-w-16 aspect-h-9 w-full h-72">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${workout_exercise.exercise.video}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                                </iframe>
                            </div>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ) : (
                    <div className='h-12 w-12'></div>
                )
            }
            <Drawer>
                <DrawerTrigger className='absolute top-1 right-3'><FontAwesomeIcon icon={faEllipsis} /></DrawerTrigger>
                <DrawerContent className='h-1/2'>
                    <DrawerHeader>
                    <DrawerTitle>Edit Exercise</DrawerTitle>
                    </DrawerHeader>
                    <div className='flex items-center p-6 border rounded-sm mx-4'>
                        <div className='w-1/3 font-semibold' >{workout_exercise.exercise.name}</div>
                        <Select  value={workout_exercise.sets > 0 ? workout_exercise.sets.toString() : ''}
                        onValueChange={(newValue) => handleEditSetsChange(workout_exercise.exercise.id, parseInt(newValue, 10))}
                        >
                            <SelectTrigger className="w-[55px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder='sets' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>sets</SelectLabel>
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
                                    <SelectItem value="11">11</SelectItem>
                                    <SelectItem value="12">12</SelectItem>
                                    <SelectItem value="13">13</SelectItem>
                                    <SelectItem value="14">14</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="16">16</SelectItem>
                                    <SelectItem value="17">17</SelectItem>
                                    <SelectItem value="18">18</SelectItem>
                                    <SelectItem value="19">19</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FontAwesomeIcon className='m-2' icon={faXmark} />
                        <Select  value={workout_exercise.reps > 0 ? workout_exercise.reps.toString() : ''}
                        onValueChange={(newValue) => handleEditRepsChange(workout_exercise.exercise.id, parseInt(newValue, 10))}
                        >
                            <SelectTrigger className="w-[55px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder='reps' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>reps</SelectLabel>
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
                                    <SelectItem value="11">11</SelectItem>
                                    <SelectItem value="12">12</SelectItem>
                                    <SelectItem value="13">13</SelectItem>
                                    <SelectItem value="14">14</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="16">16</SelectItem>
                                    <SelectItem value="17">17</SelectItem>
                                    <SelectItem value="18">18</SelectItem>
                                    <SelectItem value="19">19</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FontAwesomeIcon className='ml-auto' size='lg' onClick={() => deleteWorkoutExercise(workout_exercise.id)} icon={faTrashCan} />
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button onClick={() => updateWorkout()}>Save</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

    </Reorder.Item>
  );
};