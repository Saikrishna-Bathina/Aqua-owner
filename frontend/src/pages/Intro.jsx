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
    const user = localStorage.getItem("username"); // Fixed here

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
    navigate(token ? "/orders" : "/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      

      {/* Hero */}
      <div className="p-10 bg-gradient-to-b from-blue-100 via-white to-white-50 flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
              Welcome to <span className="text-blue-500">PureDrop Owner</span>
            </h1>
            <p className="text-gray-700 text-lg">
              Delivering pure, refreshing water to your customers.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {!loading && (
        <div className="flex flex-wrap justify-center gap-12 py-10 bg-white">
          <StatCard number={totalOrders} label="Total Orders" />
          <StatCard number={deliveredOrders} label="Delivered Orders" />
        </div>
      )}

      {/* Image Carousel */}
      <div className="bg-white px-4">
        <ImageCarsoul />
      </div>
    </div>
  );
};

const StatCard = ({ number, label }) => {
  return (
    <div className="text-center px-6">
      <h2 className="text-4xl font-bold text-gray-900">
        <CountUp end={number} duration={2.5} separator="," />+
      </h2>
      <p className="text-md text-gray-600 mt-2">{label}</p>
    </div>
  );
};

export default Intro;
