import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AuthPage from "./pages/authPage";
import Homepage from "./pages/homePage";
import Dashboard from "./pages/dashBoard";
import RequireAuth from "./middleware/RequireAuth";
import UploadPage from "./pages/uploadPage";
import axios from "axios";



function App() {
const API_URL = import.meta.env.VITE_API_URL;
  const wakeServer = () =>{

    try {

      const res = axios.get(`${API_URL}/test-router`);


    } catch (error){
        console.log(error)
    }


  }

  setTimeout(wakeServer(), 1000 * 60 * 9 )
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<AuthPage />} />
        <Route path="/" element={<Homepage />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/upload/:id" element={<UploadPage />} />
        
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
