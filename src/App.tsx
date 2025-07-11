import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TechnologyPage from './pages/TechnologyPage';
import FeaturesPage from './pages/FeaturesPage';
import DemoPage from './pages/DemoPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import UserDashboard from './pages/UserDashboard';
import StoreDashboard from './pages/StoreDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicantsRegisterPage from './pages/ApplicantsRegisterPage';
import PalmRegisterPage from './pages/PalmRegisterPage';
import TransferPage from './pages/TransferPage';
import HistoryPage from './pages/HistoryPage';
import ReceivePage from './pages/ReceivePage';
import { useEffect } from 'react';

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4
};

function App() {
  useEffect(() => {
    // Clean up bad localStorage values on startup
    const badValues = ['undefined', 'null'];
    ['user', 'session'].forEach((key) => {
      const val = localStorage.getItem(key);
      if (badValues.includes(val)) {
        localStorage.removeItem(key);
      }
    });
  }, []);
  return (
    <Router>
      <div className="min-h-screen bg-tech-blue font-space font-light">
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div
                  key="home"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <HomePage />
                </motion.div>
              } />
              <Route path="/technology" element={
                <motion.div
                  key="technology"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TechnologyPage />
                </motion.div>
              } />
              <Route path="/features" element={
                <motion.div
                  key="features"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <FeaturesPage />
                </motion.div>
              } />
              <Route path="/demo" element={
                <motion.div
                  key="demo"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DemoPage />
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div
                  key="contact"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ContactPage />
                </motion.div>
              } />
              <Route path="/admin" element={
                <RequireAuth>
                <motion.div
                  key="admin"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AdminPage />
                </motion.div>
                </RequireAuth>
              } />
              <Route path="/user-dashboard" element={
                <RequireAuth>
                <motion.div
                  key="user-dashboard"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UserDashboard />
                </motion.div>
                </RequireAuth>
              } />
              <Route path="/store-dashboard" element={
                <motion.div
                  key="store-dashboard"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StoreDashboard />
                </motion.div>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/applicants-register" element={
                <motion.div
                  key="applicants-register"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ApplicantsRegisterPage />
                </motion.div>
              } />
              <Route path="/palm-register" element={
                <motion.div
                  key="palm-register"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PalmRegisterPage />
                </motion.div>
              } />
              <Route path="/transfer" element={
                <motion.div
                  key="transfer"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TransferPage />
                </motion.div>
              } />
              <Route path="/history" element={
                <motion.div
                  key="history"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <HistoryPage />
                </motion.div>
              } />
              <Route path="/receive" element={
                <motion.div
                  key="receive"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ReceivePage />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </Layout>
      </div>
    </Router>
  );
}

export default App;