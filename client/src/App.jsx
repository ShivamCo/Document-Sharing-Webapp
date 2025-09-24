import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AuthPage from "./pages/authPage";
import Homepage from "./pages/homePage";
import Dashboard from "./pages/dashBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<AuthPage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
