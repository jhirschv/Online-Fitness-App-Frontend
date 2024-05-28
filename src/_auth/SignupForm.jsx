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
import { generateKeyPair } from '../utils/crypto';
import { useTheme } from "@/components/theme-provider"

export function SignupForm() {
  let {setUser, setAuthTokens, loginUser} = useContext(AuthContext)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value) => {
    let errorMsg = null;
    if (!value) {
      errorMsg = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      switch (name) {
        case 'email':
          // Validate email using a regex that checks for a general valid email pattern
          if (!/\S+@\S+\.\S+/.test(value)) {
            errorMsg = 'Email is invalid';
          }
          break;
        case 'username':
          // Username must be between 4-20 characters and can only contain alphanumeric characters and underscores
          if (!/^[a-zA-Z0-9_]{4,20}$/.test(value)) {
            errorMsg = 'Username must be 4-20 characters long and can only contain alphanumeric characters and underscores';
          }
          break;
        case 'password':
          // Password must be between 8-20 characters and can contain alphanumeric and special characters
          if (!/^[a-zA-Z0-9!@#$%^&*()_+=\[\]{};:'"\\|,.<>\/?~-]{8,20}$/.test(value)) {
            errorMsg = 'Password must be 8-20 characters long and can contain alphanumeric and special characters';
          }
          break;
        default:
          break;
      }
    }
    return errorMsg;
};

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
    event.preventDefault();
    const newErrors = {};

    // Validate all fields on submit
    ['username', 'email', 'password'].forEach(field => {
        const value = field === 'username' ? username : field === 'email' ? email : password;
        const error = validateField(field, value);
        if (error) {
            newErrors[field] = error;
        }
    });

    // Check for any validation errors
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return; // Stop the function if there are errors
    }

    // If validation passes, try to register the user
    try {
        const registrationResponse = await apiClient.post('api/register/', {
            username,
            email,
            password
        });

        // If registration is successful, log in the user
        if (registrationResponse.data) {
            try {
                const tokenResponse = await apiClient.post('api/token/', {
                    username,
                    password
                });
        
                const data = tokenResponse.data;
                if (data) {
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    setAuthTokens(data);
                    const user = jwtDecode(data.access);
                    setUser(user);
                    navigate('/');
                } else {
                    console.error('Authentication failed after registration');
                    alert('Unable to log in automatically, please try to log in manually.');
                }
            } catch (error) {
                console.error('Login failed:', error.response ? error.response.data : error);
                alert('Login failed!');
            }
        } else {
            console.error('Registration failed with no data return');
            alert('Registration failed!');
        }
    } catch (error) {
        console.error('Signup failed:', error);
        // Optionally handle errors, e.g., displaying a message to the user
        if (error.response) {
            // Handle specific error response from backend if needed
            console.error('Registration Error:', error.response.data);
            // Populate the errors state with backend validation messages if any
            setErrors(error.response.data.errors);
        }
    }
};
const { setTheme } = useTheme()
const { theme } = useTheme();
const fontColor = theme === 'dark' ? 'text-muted-foreground' : 'text-primary';

  return (
    <div className="bg-default h-screen flex flex-col gap-4 items-center justify-center gap-x-4">
      <div className='flex font-bold text-5xl'><h1>Train.</h1><h1 className={`${fontColor}`}>io</h1></div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>to start your training journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input maxLength={40} id="email" name="email" value={email} onChange={handleEmailChange} className={errors.email ? 'border-red-500' : ''} placeholder="Enter your email"/>
                {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input maxLength={30} type="text" id="username" name="username" value={username} onChange={handleUsernameChange} className={errors.username ? 'border-red-500' : ''} placeholder="Enter username"/>
                {errors.username && <div className="text-sm text-red-500">{errors.username}</div>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input maxLength={30} type="password" id="password" name="password" value={password} onChange={handlePasswordChange} className={errors.password ? 'border-red-500' : ''} placeholder="Enter password"/>
                {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
              </div>
              <Button type="submit">Sign up</Button>
              {errors.form && <div className="text-sm text-red-500 text-center">{errors.form}</div>}
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