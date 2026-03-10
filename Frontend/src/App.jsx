import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Footer from './components/Footer'
import FreeBook from './components/FreeBook'
import Courses from './components/Courses'
import About from './components/About';
import Contact from './components/Contact';
import Signup from './components/Signup';
import { useAuth } from './context/AuthProvider';


function App() {
const[authUser,setauthUSer]=useAuth();


  return (
    <div className="dark:bg-slate-900 dark:text-white">

    <Router>
      <Navbar />
     
      <Routes>
        <Route path="/" element={<><Banner /><FreeBook /></>} />
        <Route path="/courses" element={authUser?<Courses />:<Navigate to ="/signup"/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
                <Route path="/signup" element={<Signup />} />

      </Routes>
      <Footer />
    </Router>
    <Toaster />
    </div>
  );
}


export default App


