import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header' 
import Body from './components/Body'
import AdminPanel from './components/AdminPanel'

import './App.css'
 
function App() {
  
  return (
     
      <BrowserRouter>
      <Header />
      <Routes>
      <Route path="/" element={<Body />} />
      <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      </BrowserRouter>
    
  )
}

export default App
