import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header' 
import Body from './components/Body'
import Footer from './components/Footer'
import Administracion from './components/Administracion'
import ProductDetail from './components/ProductDetail'
import ProductGallery from './components/ProductGallery'
import Form from './components/Form'
import ProductsTable from './components/ProductsTable'
import RegistrationForm from './components/RegistrationForm'


import './App.css'
 
function App() {
  
  return (
     
      <BrowserRouter>
      <Header />
      <Routes>
      <Route path="/" element={<Body />} />
      <Route path="/administracion" element={<Administracion />} />
      <Route path="/form" element={<Form />} />
      <Route path="/table" element={<ProductsTable />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/productGallery/:id" element={<ProductGallery />} />
      <Route path="/form/edit/:id" element={<Form />} />
      <Route path="/registrationForm" element={<RegistrationForm />} />
      </Routes>
      <Footer />
      </BrowserRouter>
    
  )
}

export default App
