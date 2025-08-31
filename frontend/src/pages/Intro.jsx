import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ImageCarsoul from "../components/ImageCarsoul";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";

const Intro = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("username");

      if (!user || !token) {
        console.warn("User or token not found in localStorage.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/orders/my-shop-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedOrders = response.data.orders || [];
      setOrders(fetchedOrders);
      console.log("Fetched Orders:", fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Re-fetch every 5s
    return () => clearInterval(interval);
  }, []);

  // Order counts
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(
    (order) => order.deliveryStatus?.toLowerCase() === "delivered"
  ).length;

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="p-8 md:p-16 bg-gradient-to-b from-blue-100 via-white to-white-50 flex items-center justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-left md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-700 leading-tight">
              Welcome to <span className="text-blue-500">PureDrop Owner</span>
            </h1>
            <p className="text-gray-700 text-lg md:text-xl lg:text-2xl max-w-xl mx-auto md:mx-0">
              Delivering pure, refreshing water to your customers.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl shadow-md transition-all duration-300 text-lg"
            >
              Get Started
            </button>
          </div>

          {/* Right Content (Carousel, visible on both mobile & desktop) */}
          <div className="flex justify-center">
            <ImageCarsoul />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
