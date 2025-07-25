import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/orders/my-shop-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const deliveredOrders = orders.filter(
    (o) => o.deliveryStatus?.toLowerCase() === "delivered"
  );
  const pendingOrders = orders.filter(
    (o) => o.deliveryStatus?.toLowerCase() !== "delivered"
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

    return Array.from({ length: 12 }, (_, i) => {
      return (
        monthlyCount[i] || {
          name: new Date(0, i).toLocaleString("default", { month: "short" }),
          value: 0,
        }
      );
    });
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
        ? 100
        : Math.round(
            ((ordersLast30.length - ordersPrev30.length) /
              ordersPrev30.length) *
              100
          );

    return percentChange;
  };

  const growthRate = calculateOrderGrowth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <StatCard number={orders.length} label="Total Orders" />
  <StatCard number={deliveredOrders.length} label="Delivered" />
  <StatCard
  number={orders.filter((o) => o.deliveryStatus?.toLowerCase() === "pending").length}
  label="Pending"
/>

  <StatCard number={orders.filter((o) => o.deliveryStatus === "Cancelled").length} label="Cancelled" />
</div>


        {/* Order Trends Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Order Trends
          </h2>
          <p
            className={`font-medium text-sm mb-2 ${
              growthRate >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {growthRate >= 0 ? "+" : ""}
            {growthRate}%{" "}
            <span className="text-gray-500">Last 30 Days</span>
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-md font-semibold text-gray-700 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {deliveredOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Customer: {order.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Order ID: {order._id.slice(0, 8)}
                  </p>
                </div>
                <span className="text-xs font-semibold text-green-600">
                  Delivered
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 📊 Stat Card Component
const StatCard = ({ number, label, className = "" }) => (
  <div className={`bg-white shadow rounded-lg p-4 ${className}`}>
    <p className="text-2xl font-bold text-gray-900">
      <CountUp end={number} duration={2} separator="," />
    </p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

export default Dashboard;
