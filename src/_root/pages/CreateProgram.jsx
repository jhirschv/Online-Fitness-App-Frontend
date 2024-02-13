import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';

const CreateProgram = () => {

  const { theme } = useTheme();
  
  const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';


  let navigate = useNavigate();

  const handleClick = () => {
    navigate('/create');
  };

  return (
    <div className={`w-full flex justify-center items-center ${backgroundColorClass} border rounded-lg p-4`}>
        <Card className="w-[450px] h-[300px]">
          <CardHeader>
            <CardTitle>Create New Program</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name of your program" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Optional" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className='bg-secondary text-secondary-foreground' onClick={handleClick}>Create</Button>
          </CardFooter>
        </Card>
    </div>
    
  )
}

export default CreateProgram