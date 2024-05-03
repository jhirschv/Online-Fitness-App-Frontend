import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export function SignupForm() {
  let {setUser, setAuthTokens, loginUser} = useContext(AuthContext)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent the form from submitting naturally
    try {
        const response = await apiClient.post('api/register/', {
            username: username,
            email: email,
            password: password
        });

        try {
            const response = await apiClient.post('api/token/', {
              username: username,
              password: password
            });
      
            const data = response.data;
            if (data) {
              localStorage.setItem('authTokens', JSON.stringify(data));
              setAuthTokens(data);
              setUser(jwtDecode(data.access));
              navigate('/');
            } else {
              alert('Something went wrong!');
            }
          } catch (error) {
            alert('Login failed!');
          }
    } catch (error) {
        console.error('Signup failed:', error);
        // Optionally handle errors, e.g., displaying a message to the user
        if (error.response) {
            // Handle specific error response from backend if needed
            console.error('Registration Error:', error.response.data);
        }
    }
};

  return (
    <div className="bg-default h-screen flex items-center justify-center gap-x-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>to start your training journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" value={email} onChange={handleEmailChange} placeholder="Enter your email"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} placeholder="Enter username"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} placeholder="Enter password"/>
              </div>
              <Button type="submit">Sign up</Button>
              <div className="text-center mt-4">
                <p>
                  Have an account? <Link to="/login" className="text-blue-500 hover:text-blue-600">Log in</Link>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupForm;