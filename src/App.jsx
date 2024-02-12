import YourWorkouts from './_root/pages/YourPrograms';
import PrivateRoute from './utils/PrivateRoute'
import CreateProgram from './_root/pages/CreateProgram';
import Clients from './_root/pages/Clients';
import SigninForm from './_auth/SigninForm';
import Exercises from './_root/pages/ExerciseLibrary';
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import Create from './_root/pages/Create';


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<PrivateRoute />}>
              <Route index element={<CreateProgram />} />  
              <Route path="create" element={<Create />} />  
              <Route path="/yourWorkouts" element={<YourWorkouts />} />
              <Route path="/page2" element={<Clients />} />
              <Route path="/exercises" element={<Exercises />} />
            </Route>
          </Route>
          <Route path="/login" element={<SigninForm />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
