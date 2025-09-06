import {BrowserRouter , Router, Routes, Route} from 'react-router-dom'
import Home from '../Pages/User/Home/Home'
import Navbar from '../Components/Navbar/navBar'




export default function MainLayout() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
};
