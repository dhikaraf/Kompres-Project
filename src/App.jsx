import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserProvider } from './context/UserContext';

import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Wizard from './pages/Onboarding/Wizard';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';

import Goal from './pages/Onboarding/Goal';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/onboarding' element={<Wizard />} />
          <Route path='/onboarding/goal' element={<Goal />} />

          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
