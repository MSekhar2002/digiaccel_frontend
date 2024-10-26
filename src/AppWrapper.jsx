import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { OnboardingPage } from './OnboardingPage';

const AppWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/home" element={<App />} />
      </Routes>
    </Router>
  );
};

export default AppWrapper;
