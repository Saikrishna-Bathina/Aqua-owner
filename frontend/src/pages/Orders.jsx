import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("User not authenticated. Token missing.");

      const response = await fetch("http://localhost:5000/api/orders/my-shop-orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Unknown error");
    }
  };

 useEffect(() => {
  const intervalId = setInterval(() => {
    fetchOrders();
  }, 2000); // 2000 milliseconds = 2 seconds

  // Cleanup on component unmount
  return () => clearInterval(intervalId);
}, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Customer Orders</h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-6 rounded shadow">
          ⚠️ {error}
        </div>
      )}

      {orders.length === 0 && !error && (
        <p className="text-gray-600">No orders found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-xl p-4 border border-blue-100"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Order #{order._id}
            </h2>

            {/* Customer Details */}
            <p><strong>Customer:</strong> {order.customerName || "N/A"}</p>
            <p><strong>Phone:</strong> {order.phoneNumber || "N/A"}</p>
            <p><strong>Address:</strong> {order.userAddress || "N/A"}</p>



            {/* Order Items */}
            <div className="mt-3">
              <p className="font-medium">Items Ordered:</p>
              <ul className="list-disc list-inside text-gray-700">
                {order.orderItems?.waterTins > 0 && (
                  <li>Water Tins: {order.orderItems.waterTins}</li>
                )}
                {order.orderItems?.coolingWaterTins > 0 && (
                  <li>Cooling Water Tins: {order.orderItems.coolingWaterTins}</li>
                )}
                {order.orderItems?.waterBottles > 0 && (
                  <li>Water Bottles: {order.orderItems.waterBottles}</li>
                )}
                {order.orderItems?.waterPackers > 0 && (
                  <li>Water Packers: {order.orderItems.waterPackers}</li>
                )}
                {Object.values(order.orderItems || {}).every(q => q === 0) && (
                  <li>No items ordered</li>
                )}
              </ul>
            </div>

            {/* Payment & Status */}
            <p className="mt-3">
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={
                  order.paymentStatus === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {order.paymentStatus}
              </span>
            </p>

            <p>
              <strong>Amount:</strong> ₹{order.amount || "0"}
            </p>

            {/* Date */}
            <p className="text-gray-500 text-sm mt-2">
              <strong>Placed on:</strong>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
