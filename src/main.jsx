import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { ThemeProvider } from '@material-tailwind/react'
import { AuthProvider } from './Context/AuthProvider'
ReactDOM.createRoot(document.getElementById('root')).render(
  
  
  <BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
      <Routes>
        <Route path='/*' element={<App/>}></Route>
      </Routes>
   
    </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
 
  
)
