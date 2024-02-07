import React from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faArrowLeft, faEllipsis  } from '@fortawesome/free-solid-svg-icons';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

const Create = () => {
  return (
    <div className='w-full flex'>
        <div className='flex-1 border'>
            
            <Card className='h-full'>
                <FontAwesomeIcon className='ml-3 mt-3' size='xl' icon={faArrowLeft} />
                <CardHeader>
                    <CardTitle>Workout Name</CardTitle>
                    <CardDescription>Workout Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='mb-2'>Exercises</p>
                    <Card className='relative'> 
                        <div className='absolute top-1 right-4'>
                            <Popover>
                                <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                <PopoverContent>Place content for the popover here.</PopoverContent>
                            </Popover>
                        </div> 
                        
                        <CardContent className="mt-5 flex">
                            <p className='mt-3'>Back Squat</p>

                            <div className='flex items-center ml-10'>
                            <Select>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder="sets" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>sets</SelectLabel>
                                        <SelectItem value="cat">1</SelectItem>
                                        <SelectItem value="cat">2</SelectItem>
                                        <SelectItem value="cat">3</SelectItem>
                                        <SelectItem value="cat">4</SelectItem>
                                        <SelectItem value="cat">5</SelectItem>
                                        <SelectItem value="cat">6</SelectItem>
                                        <SelectItem value="cat">7</SelectItem>
                                        <SelectItem value="cat">8</SelectItem>
                                        <SelectItem value="cat">9</SelectItem>
                                        <SelectItem value="cat">10</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <h1 className='m-3 font-bold'>X</h1>
                            <Select>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder="reps" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>reps</SelectLabel>
                                        <SelectItem value="cat">1</SelectItem>
                                        <SelectItem value="cat">2</SelectItem>
                                        <SelectItem value="cat">3</SelectItem>
                                        <SelectItem value="cat">4</SelectItem>
                                        <SelectItem value="cat">5</SelectItem>
                                        <SelectItem value="cat">6</SelectItem>
                                        <SelectItem value="cat">7</SelectItem>
                                        <SelectItem value="cat">8</SelectItem>
                                        <SelectItem value="cat">9</SelectItem>
                                        <SelectItem value="cat">10</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            </div>
                            
                        </CardContent>
                        
                    </Card>
                </CardContent>
            </Card>
        </div>
        <div className='flex-1 flex-col border'>
            <ScrollArea className="h-96 w-full rounded-md border">
                <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Exercises</h4>
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                    <div className="text-sm">lateral Raises</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Pull-ups</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Bicep Curls</div>
                    <Separator className="my-2" />
                    <div className="text-sm">Tricep Extensions</div>
                    <Separator className="my-2" />
                </div>
            </ScrollArea>

        </div>
        
    </div>
  )
}

export default Create