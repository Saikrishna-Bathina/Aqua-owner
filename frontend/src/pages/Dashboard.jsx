import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis // Added YAxis import for complete chart styling
} from "recharts";

// 📊 Stat Card Component - Enhanced for attractiveness and blue color
const StatCard = ({ number, label, className = "", onClick }) => (
  <div
    className={`bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-blue-50 transition ${className}`}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={`Go to orders filtered by ${label}`}
  >
    <p className="text-2xl font-bold text-gray-800">
      <CountUp end={number} duration={2} separator="," />
    </p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Optionally redirect to login if no token
        // navigate('/login');
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/my-shop-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      // Handle error, e.g., show a user-friendly message
    } finally {
      setLoading(false);
    }
  };

  const deliveredOrders = orders.filter(
    (o) => o.deliveryStatus?.toLowerCase() === "delivered"
  );
  const pendingOrders = orders.filter(
    (o) => o.deliveryStatus?.toLowerCase() === "pending"
  );
  const cancelledOrders = orders.filter(
    (o) => o.deliveryStatus?.toLowerCase() === "cancelled"
  );


  // 🔢 Get monthly trends from real data
  const getMonthlyOrderTrends = () => {
    const monthlyCount = {};

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      const monthIndex = date.getMonth(); // 0-11
      const monthName = date.toLocaleString("default", { month: "short" });

      monthlyCount[monthIndex] = {
        name: monthName,
        value: (monthlyCount[monthIndex]?.value || 0) + 1,
      };
    });

    // Ensure all 12 months are present, even if no orders
    // Sort by month index to ensure correct order for the chart
    const allMonthsData = Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(0, i).toLocaleString("default", { month: "short" });
      return monthlyCount[i] || { name: monthName, value: 0 };
    });

    return allMonthsData;
  };

  const chartData = getMonthlyOrderTrends();

  // 📈 Calculate order growth in last 30 days
  const calculateOrderGrowth = () => {
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(last30.getDate() - 30);

    const last60 = new Date(now);
    last60.setDate(last60.getDate() - 60);

    const ordersLast30 = orders.filter(
      (o) => new Date(o.createdAt) > last30
    );
    const ordersPrev30 = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d > last60 && d <= last30;
    });

    const percentChange =
      ordersPrev30.length === 0
        ? (ordersLast30.length > 0 ? 100 : 0) // If no prev orders, 100% growth if current orders exist, else 0%
        : Math.round(
            ((ordersLast30.length - ordersPrev30.length) /
              ordersPrev30.length) *
              100
          );

    return percentChange;
  };

  const growthRate = calculateOrderGrowth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-blue-700 text-xl font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    // Main container with a subtle blue gradient background for a fresh look
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8"> {/* Increased max-width for more space */}
        {/* Dashboard Title */}
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">Dashboard Overview</h1> {/* Larger title, centered */}

        {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
  <StatCard
    number={orders.length}
    label="Total Orders"
    onClick={() => navigate("/orders")}
  />
  <StatCard
    number={deliveredOrders.length}
    label="Delivered"
    onClick={() => navigate("/orders?filter=Delivered")}
  />
  <StatCard
    number={pendingOrders.length}
    label="Pending"
    onClick={() => navigate("/orders?filter=Pending")}
  />
  <StatCard
    number={cancelledOrders.length}
    label="Cancelled"
    onClick={() => navigate("/orders?filter=Cancelled")}
  />
</div>

        {/* Order Trends Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"> {/* Enhanced card styling with subtle border */}
          <h2 className="text-xl font-bold text-blue-800 mb-3"> {/* Darker blue for heading */}
            Order Trends
          </h2>
          <p
            className={`font-medium text-sm mb-4 ${
              growthRate >= 0 ? "text-green-600" : "text-red-600" // Green for positive, red for negative growth
            }`}
          >
            {growthRate >= 0 ? "+" : ""}
            {growthRate}%{" "}
            <span className="text-gray-500">Last 30 Days</span>
          </p>
          
<ResponsiveContainer width="100%" height={250}>
  {chartData && chartData.length > 0 ? (
    <LineChart
      data={chartData}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      key={JSON.stringify(chartData)}
    >
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: "#6b7280" }} // Use tick prop for styling
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: "#6b7280" }} // Use tick prop for styling
      />
      <Tooltip
        cursor={{ strokeDasharray: '3 3' }}
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        wrapperStyle={{ outline: 'none' }}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#3b82f6"
        strokeWidth={3}
        dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: '#3b82f6' }}
      />
    </LineChart>
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500">No chart data available.</div>
  )}
</ResponsiveContainer>

        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"> {/* Enhanced card styling with subtle border */}
          <h2 className="text-xl font-bold text-blue-800 mb-4"> {/* Darker blue for heading */}
            Recent Orders
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2"> {/* Added vertical spacing and scrollbar padding */}
            {/* Ensure deliveredOrders is an array before mapping to prevent errors if data is not yet loaded */}
            {deliveredOrders && deliveredOrders.length > 0 ? (
              deliveredOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 hover:bg-blue-50 transition-colors duration-150 rounded-md px-2 -mx-2" // Added hover effect
                >
                  <div>
                    <p className="text-base font-medium text-gray-800">
                      Customer: {order.customerName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Order ID: {order._id.slice(0, 8)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full"> {/* Attractive status badge */}
                    Delivered
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent delivered orders.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
