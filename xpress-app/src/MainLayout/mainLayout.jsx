import {BrowserRouter , Router, Routes, Route} from 'react-router-dom'
import Home from '../Pages/Home/home';
import Navbar from '../Components/Navbar/navBar'
import Footer from '../Components/Footer/footer'; 




export default function MainLayout() {

  return (
    <BrowserRouter basename='/Xpress-auto/'>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
};
