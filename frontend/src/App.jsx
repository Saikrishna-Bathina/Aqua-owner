import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import { Toaster, toast } from 'sonner';
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors/>
      <Navbar /> {/* Always visible */}
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}


export default App;
