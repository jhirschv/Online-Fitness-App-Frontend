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



function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {

  const [selectedEvent, setSelectedEvent] = React.useState(null);

  // Handler to open the dialog for a specific event
  const handleOpenDialog = (event) => {
    setSelectedEvent(event);
  };

  const events = [
    { date: '2024-03-10', name: 'Lower Body 1' },
    { date: '2024-03-04', name: 'Upper Body 2' },
    // Add more events as needed
  ];

  
  const CustomDay = ({ date, activeModifiers, displayMonth, ...props }) => {
    const dateString = date.toISOString().split('T')[0];
    const event = events.find(event => event.date === dateString);
  
    // Custom rendering for dates with events
    if (event) {
      return (
        <div {...props} className="flex flex-col items-center justify-center h-full w-full relative bg-accent rounded-md">
        <div className="flex items-center justify-center">
          <span>{date.getDate()}</span>
        </div>
        <div onClick={() => handleOpenDialog(event)} className="absolute top-2 right-1 text-xs px-2">
          <FontAwesomeIcon size='lg' icon={faCheck} />
        </div>
      </div>
      );
    }
  
    // Fallback to default rendering for dates without events
    return (
      <div {...props} className="day-cell">
        {date.getDate()}
      </div>
    );
  };

  return (
    (<>
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center p-2 relative items-center",
        caption_label: "text-lg font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-24 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-[4.5rem] w-24 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-[4.5rem] w-24 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
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
