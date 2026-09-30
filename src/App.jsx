import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserProvider } from './context/UserContext';

import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Wizard from './pages/Onboarding/Wizard';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import History from './pages/History/History';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* =========================
              PUBLIC ROUTES
              ========================= */}

          <Route path='/' element={<LandingPage />} />

          <Route path='/login' element={<Login />} />

          <Route path='/register' element={<Register />} />

          {/* =========================
              PROTECTED ROUTES
              ========================= */}

          <Route element={<ProtectedRoute />}>
            <Route path='/onboarding' element={<Wizard />} />

            <Route path='/dashboard' element={<Dashboard />} />

            <Route path='/profile' element={<Profile />} />

            <Route path='/history' element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
