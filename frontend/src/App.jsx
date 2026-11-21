import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

            {/* My Bookings */}
            <Route path="/bookings" element={<MyBookings />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;