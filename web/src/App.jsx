import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constant';
import Home from './components/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Profile from './components/auth/Profile';
import LearnMore from './components/LearnMore';
import Analysis from './components/features/Analysis';
import MealPlanner from './components/features/MealPlanner';
import HealthTracker from './components/features/HealthTracker';
import Updates from './components/features/Updates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.LEARN_MORE} element={<LearnMore />} />
        <Route path={ROUTES.ANALYSIS} element={<Analysis />} />
        <Route path={ROUTES.MEAL_PLANNER} element={<MealPlanner />} />
        <Route path={ROUTES.HEALTH_TRACKER} element={<HealthTracker />} />
        <Route path={ROUTES.UPDATES} element={<Updates />} />
      </Routes>
    </Router>
  );
}

export default App;