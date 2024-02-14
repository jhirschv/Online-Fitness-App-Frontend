import Programs from './_root/pages/Programs';
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


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path="create" element={<Create />} />  
              <Route index element={<Programs />} />
              <Route path="/clients" element={<Clients />} />
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
