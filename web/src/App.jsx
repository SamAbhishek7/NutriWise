import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constant';
import Home from './components/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import LearnMore from './components/LearnMore';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
    </Router>
  );
};

export default App;