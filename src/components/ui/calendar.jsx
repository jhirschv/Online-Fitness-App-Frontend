"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useActiveModifiers } from "react-day-picker"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
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


import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import apiClient from '../../services/apiClient';



function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDataReceive,

  ...props
}) {

  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [userWorkoutSessions, setUserWorkoutSessions] = React.useState([])

  // Handler to open the dialog for a specific event
  const handleOpenDialog = (event) => {
    setSelectedEvent(event);
  };


  React.useEffect(() => {
    apiClient.get('/user_workout_sessions/')
        .then(response => {
            setUserWorkoutSessions(response.data)
            })
        
        .catch(error => console.error('Error:', error));
    }, []);
  
    const sendDataToParent = (childData) => {
      onDataReceive(childData);
    };

  
  const CustomDay = ({ date, activeModifiers, displayMonth, ...props }) => {
    const dateString = date.toISOString().split('T')[0];
    const dayData = userWorkoutSessions.find(workout => workout.date.split('T')[0] === dateString);
  
    // Custom rendering for dates with dayDatas
    if (dayData) {
      return (
        <div onClick={() => sendDataToParent(dayData)} {...props} className={`flex flex-col items-center justify-center h-full w-full relative ${activeModifiers.selected? "bg-primary" : "bg-accent"} rounded-md`}>
          <div className="flex items-center justify-center">
            <span>{date.getDate()}</span>
          </div>
          <div onClick={() => handleOpenDialog(dayData)} className="absolute top-2 right-1 text-xs px-2">
            <FontAwesomeIcon className='hidden' size='lg' icon={faCheck} />
          </div>
      </div>
      );
    }
  
    // Fallback to default rendering for dates without events
    return (
      <div onClick={() => sendDataToParent(null)} {...props} className={`day-cell flex h-full w-full items-center justify-center`}>
        <p className="relative">{date.getDate()}</p>
        {activeModifiers.today? <div className="text-xs absolute bottom-3 right-8"></div> : <></>}
      </div>
    );
  };

  return (
    (<>
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "h-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full h-full",
        caption: "flex justify-center p-2 relative items-center",
        caption_label: "text-lg font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "h-full w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
        row: "h-[15%] flex w-full mt-1",
        cell: "mx-[1px] rounded-md h-full w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-full w-full p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:rounded-md focus:text-primary-foreground",
        day_today: "bg-primary text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        DayContent: CustomDay,
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props} />
      {selectedEvent && (
        <AlertDialog open={Boolean(selectedEvent)} onOpenChange={() => setSelectedEvent(null)}>
          <AlertDialogTrigger asChild>
            {/* This is now just a placeholder; the actual trigger is handled by the day clicks */}
            <button style={{display: "none"}}></button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedEvent.name}</AlertDialogTitle>
              <AlertDialogDescription>
                Event details for {selectedEvent.date}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedEvent(null)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      </>)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
