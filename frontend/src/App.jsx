import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookings" element={<MyBookings />} />

              {/* Redirect unknown URLs to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;