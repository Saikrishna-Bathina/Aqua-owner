import React, { useContext, useState } from "react";
import { Menu, LogIn, ChevronUp, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout(); // ✅ use context's logout function
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between relative z-50">
      {/* Left: Logo + Hamburger */}
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform"
        >
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-gray-700 rotate-180 duration-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 duration-300" />
          )}
        </button>

        {/* Logo */}
        <div
          className="font-inter text-2xl font-semibold flex items-center cursor-pointer"
          onClick={() => {
            navigate(isAuthenticated ? "/home" : "/");
            setIsOpen(false);
          }}
        >
          <span className="text-blue-800">Pure</span>
          <span className="text-blue-800">Drop</span>
          <span className="w-2 inline-block"></span>
          <span className="text-blue-400"> Owner</span>
        </div>
      </div>

      {/* Right: Login/Profile (Mobile Only) */}
      <div className="md:hidden">
        {isAuthenticated ? (
          <button
            onClick={() => {
              navigate("/profile");
              setIsOpen(false);
            }}
            className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800 transition duration-200"
          >
            <UserCircle className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800 transition duration-200"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </button>
        )}
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-gray-700 font-medium ml-auto">
        <li onClick={() => navigate("/")} className="hover:text-blue-600 cursor-pointer">
          Home
        </li>
        <li onClick={() => navigate("/orders")} className="hover:text-blue-600 cursor-pointer">
          My Orders
        </li>
        {isAuthenticated ? (
          <>
            <li onClick={() => navigate("/profile")} className="hover:text-blue-600 cursor-pointer">
              Profile
            </li>
            <li onClick={handleLogout} className="hover:text-red-500 cursor-pointer transition duration-200">
              Logout
            </li>
          </>
        ) : (
          <>
            <li onClick={() => navigate("/login")} className="hover:text-blue-600 cursor-pointer">
              Login
            </li>
            <li onClick={() => navigate("/register")} className="hover:text-blue-600 cursor-pointer">
              Register
            </li>
          </>
        )}
      </ul>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-40 md:hidden transition-all duration-300 ease-in-out">
          <ul className="flex flex-col space-y-4 p-4 text-gray-700 font-medium">
            <li
              onClick={() => {
                navigate("/");
                toggleMenu();
              }}
              className="hover:text-blue-600 cursor-pointer"
            >
              Home
            </li>
            <li
              onClick={() => {
                navigate("/orders");
                toggleMenu();
              }}
              className="hover:text-blue-600 cursor-pointer"
            >
              My Orders
            </li>
            {isAuthenticated ? (
              <>
                <li
                  onClick={() => {
                    navigate("/profile");
                    toggleMenu();
                  }}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Profile
                </li>
                <li
                  onClick={handleLogout}
                  className="hover:text-red-500 cursor-pointer transition duration-200"
                >
                  Logout
                </li>
              </>
            ) : (
              <>
                <li
                  onClick={() => {
                    navigate("/login");
                    toggleMenu();
                  }}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Login
                </li>
                <li
                  onClick={() => {
                    navigate("/register");
                    toggleMenu();
                  }}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Register
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
