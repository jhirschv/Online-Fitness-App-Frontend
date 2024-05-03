import React from 'react'
import {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Link } from 'react-router-dom';

export function SigninForm() {

  let {loginUser} = useContext(AuthContext)

  return (
    <div className="bg-deafult h-screen flex items-center justify-center gap-x-4">
        <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>to start your training journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginUser}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input type="text" name="username" placeholder="Enter username"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Password</Label>
                <Input type="password" name="password" placeholder="enter password"/>
              </div>
              <Button type="submit">Sign in</Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-600">Sign up</Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
  )
}

export default SigninForm

{/*  */}

{/* <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="username" {...field} />
          </FormControl>
          <FormDescription>
            This is your public display name.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="shad-form_label">Password</FormLabel>
          <FormControl>
            <Input type="password" className="shad-input" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Sign in</Button>
  </form>
</Form> */}