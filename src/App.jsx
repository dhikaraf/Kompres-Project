import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserProvider } from './context/UserContext';

import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Wizard from './pages/Onboarding/Wizard';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import History from './pages/History/History';
import Schedule from './pages/Schedule/Schedule';
import Nutrition from './pages/Nutrition/Nutrition';
import WorkoutPlan from './pages/WorkoutPlan/WorkoutPlan';

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

            <Route path='/schedule' element={<Schedule />} />

            <Route path='/nutrition' element={<Nutrition />} />

            <Route path='/workout-plan' element={<WorkoutPlan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
