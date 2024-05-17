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
    dragControls.start(event); 
  };

  const handleOnPointerUp = () => {
    // Delay resetting isDragging to allow onClick to check its value
    setTimeout(() => {
      setIsDragging(false);
    }, 100); // Short delay to differentiate between drag end and click
    onPointerUp && onPointerUp(); // Call any additional logic provided by onPointerUp
  };

  return (
    <Reorder.Item dragControls={dragControls} 
    id={workout_exercise} key={workout_exercise.id} value={workout_exercise} dragListener={false} 
    className='w-full flex items-center h-12 px-2 border rounded-xs relative my-2'>
        <div  onPointerDown={onDragStart} className='text-border'>
            <FontAwesomeIcon size='lg' icon={faGripVertical} />
        </div>
        <div className='font-semibold py-2 px-4'>{index + 1}. {workout_exercise.exercise.name}</div>
        <div className='font-semibold ml-auto mr-[10%]'>{workout_exercise.sets} x {workout_exercise.reps}</div>
    </Reorder.Item>
  );
};