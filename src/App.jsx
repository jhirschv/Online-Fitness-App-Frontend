import Programs from './_root/pages/Programs';
import Train from './_root/pages/Train';
import PrivateRoute from './utils/PrivateRoute'
import CreateProgram from './_root/pages/CreateProgram';
import Clients from './_root/pages/Clients';
import Progress from './_root/pages/Progress';
import Chat from './_root/pages/Chat';
import Settings from './_root/pages/Settings';
import SigninForm from './_auth/SigninForm';
import ExerciseLibrary from './_root/pages/ExerciseLibrary';
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import Create from './_root/pages/Create';
import ProgramDetails from './_root/pages/ProgramDetails';
import PhaseDetails from './_root/pages/Workouts';
import WorkoutDetails from './_root/pages/WorkoutDetails';
import ProgramOverview from './_root/pages/ProgramOverview';


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path="create/:phaseId/:workoutId" element={<Create />} />  
              <Route index element={<Programs />} />
              <Route path="/programs/:programId" element={<ProgramDetails />} />
              <Route path="/program_overview/:programId" element={<ProgramOverview />} />
              <Route path="/programs/phases/:phaseId" element={<PhaseDetails />} />
              <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/train" element={<Train />} />
              <Route path="/Progress" element={<Progress />} />
              <Route path="/Chat" element={<Chat />} />
              <Route path="/exerciseLibrary" element={<ExerciseLibrary />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="/login" element={<SigninForm />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
