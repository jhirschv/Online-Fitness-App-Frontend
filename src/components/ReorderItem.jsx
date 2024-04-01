import * as React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { ReorderIcon } from "./Icon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faChevronRight, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

export const ReorderItem = ({ isDragging, setIsDragging, onPointerDown, onPointerUp, onPointerCancel, workout, index, handleWorkoutClick, clickedWorkout, deleteWorkout }) => {
  const dragControls = useDragControls();
  const onDragStart = (event) => {
    event.stopPropagation();
    dragControls.start(event); 
    setIsDragging(true); 
    onPointerDown();

  };

  return (
    <Reorder.Item onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} onClick={() => handleWorkoutClick(workout)} dragControls={dragControls} id={workout} key={workout.id} value={workout} 
    dragListener={false}  className="w-full flex justify-between h-20 px-4 border rounded-xs relative my-2" 
    >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${clickedWorkout && clickedWorkout.id === workout.id ? 'bg-primary' : 'bg-transparent'}`} style={{width: '5px'}}></div>
        <div className='font-semibold p-2'>{index + 1}. {workout.name}</div>
        <div  onPointerDown={onDragStart} className='pr-4 pl-2 py-4 absolute top-4 left-0 text-border'>
            <FontAwesomeIcon size='lg' icon={faGripVertical} />
        </div>
        
        <div>
            <FontAwesomeIcon className='absolute top-8 right-8' icon={faChevronRight} />
            <Popover >
                <PopoverTrigger onClick={(event) => event.stopPropagation()} className='absolute top-1 right-3'><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                    <Button onClick={(event) => {event.stopPropagation(); deleteWorkout(workout.id); }} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                    Delete Workout</Button>
                </PopoverContent>
            </Popover>
        </div>
    </Reorder.Item>
  );
};

//onClick={() => handleWorkoutClick(workout)}
//${clickedWorkout && clickedWorkout.id === workout.id ? 'bg-primary' : 'bg-transparent'}
//onClick={(event) => {event.stopPropagation(); deleteWorkout(workout.id); }}
