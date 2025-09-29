import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
// import Authentication from './pages/authentication';
// import AuthContainer from './components/auth/AuthContainer';
import { AuthProvider } from './context/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';
import History from './pages/history';
import VideoMeetingMain from './Components/VideoMeeting/VideoMeetingMain';
// import Signup from './pages/auth/Signup';
import HomeComponent from './pages/home'
import LoginPage from './pages/auth';

import LandingNewPage from './pages/landingNew';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>


        <AuthProvider>

          <Routes>





            <Route path='/' element={<LandingPage />} />
            <Route path='/landing' element={<LandingNewPage />} />
            <Route path='/auth' element={<LoginPage />} />
            <Route path='/history' element={<History />} />
            <Route path='/home' element={<HomeComponent />} />

            <Route path='/:url' element={<VideoMeetingMain />} />
          </Routes>

        </AuthProvider>




      </Router>
    </>
  )
}

export default App
