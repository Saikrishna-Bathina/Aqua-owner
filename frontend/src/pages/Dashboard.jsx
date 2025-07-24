import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeliveredList, setShowDeliveredList] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/orders/my-shop-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const deliveredOrders = orders.filter(o => o.deliveryStatus?.toLowerCase() === "delivered");
  const pendingOrders = orders.filter(o => o.deliveryStatus?.toLowerCase() !== "delivered");
  const codCount = orders.filter(o => o.paymentMethod === "COD").length;
  const onlineCount = orders.filter(o => o.paymentMethod === "Online").length;

  const totalRevenue = deliveredOrders.reduce((sum, o) => o.paymentStatus === "Paid" ? sum + (o.amount || 0) : sum, 0);

  const chartData = [
    { name: "Total", value: orders.length },
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: pendingOrders.length },
  ];

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Dashboard</h1>

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <StatCard number={orders.length} label="Total Orders" onClick={() => navigate("/orders")} isClickable />
            <StatCard number={deliveredOrders.length} label="Delivered Orders" onClick={() => setShowDeliveredList(!showDeliveredList)} isClickable />
            <StatCard number={pendingOrders.length} label="Pending Orders" />
            <StatCard number={totalRevenue} label="Total Revenue (\u20B9)" />
            <StatCard number={codCount} label="COD Payments" />
            <StatCard number={onlineCount} label="Online Payments" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Order Summary</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {showDeliveredList && (
            <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Delivered Orders</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {deliveredOrders.length === 0 ? (
                  <p className="text-gray-500">No delivered orders yet.</p>
                ) : (
                  deliveredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border p-4 rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <p><strong>Customer:</strong> {order.customerName}</p>
                      <p><strong>Phone:</strong> {order.phoneNumber}</p>
                      <p><strong>Address:</strong> {order.userAddress}</p>
                      <p><strong>Payment:</strong> {order.paymentStatus}</p>
                      <p>
                        <strong>Status:</strong> <span className="text-green-600 font-semibold">Delivered</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StatCard = ({ number, label, onClick, isClickable }) => (
  <div
    className={`text-center px-6 py-4 rounded-xl bg-white shadow hover:shadow-lg ${
      isClickable ? "cursor-pointer hover:scale-105 transition-transform" : ""
    }`}
    onClick={onClick}
  >
    <h2 className="text-4xl font-bold text-gray-900">
      <CountUp end={number} duration={2.5} separator="," />+
    </h2>
    <p className="text-md text-gray-600 mt-2">{label}</p>
  </div>
);

export default Dashboard;
