import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function Layout() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <div className="main-content">
        <AppRoutes />
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;