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
    <Reorder.Item onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} onClick={() => handleWorkoutClick(workout)} dragControls={dragControls} id={workout} key={workout.id} value={workout} 
    dragListener={false}  className="w-full flex items-center h-12 px-2 border rounded-xs relative my-2" >
        <div  onPointerDown={onDragStart} className='text-border'>
            <FontAwesomeIcon size='lg' icon={faGripVertical} />
        </div>
        <div className='font-semibold py-2 px-4'>{index + 1}. {workout.name}</div>
        
    </Reorder.Item>
  );
};

//onClick={() => handleWorkoutClick(workout)}
//${clickedWorkout && clickedWorkout.id === workout.id ? 'bg-primary' : 'bg-transparent'}
//onClick={(event) => {event.stopPropagation(); deleteWorkout(workout.id); }}
