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
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Unknown error");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/update-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deliveryStatus: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update delivery status");
      }

      fetchOrders();
    } catch (err) {
      console.error(err.message);
      setError("Failed to update delivery status");
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Dispatched: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Paid: "bg-green-100 text-green-700",
    Unpaid: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Customer Orders</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 mb-6 rounded border border-red-300">
          ⚠️ {error}
        </div>
      )}

      {orders.length === 0 && !error && (
        <p className="text-gray-500 text-center">No orders found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-50 border border-gray-200 p-5 rounded-2xl shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-blue-600">#{order._id.slice(-6)}</h2>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.deliveryStatus] || "bg-gray-200 text-gray-800"}`}
              >
                {order.deliveryStatus}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Shop:</strong> {order.shopName} ({order.shopOwner})</p>
              <p><strong>Address:</strong> {order.shopAddress}</p>
              <p><strong>Phone:</strong> {order.shopPhone}</p>
            </div>

            <hr className="my-3" />

            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.phoneNumber}</p>
              <p><strong>Delivery:</strong> {order.userAddress}</p>
            </div>

            <div className="mt-2 text-sm">
              <p className="font-medium text-gray-800">Items:</p>
              <ul className="list-disc ml-5 text-gray-700">
                {order.orderItems?.waterTins > 0 && <li>Water Tins: {order.orderItems.waterTins}</li>}
                {order.orderItems?.coolingWaterTins > 0 && <li>Cooling Water Tins: {order.orderItems.coolingWaterTins}</li>}
                {order.orderItems?.waterBottles > 0 && <li>Water Bottles: {order.orderItems.waterBottles}</li>}
                {order.orderItems?.waterPackers > 0 && <li>Water Packers: {order.orderItems.waterPackers}</li>}
                {Object.values(order.orderItems || {}).every(q => q === 0) && (
                  <li>No items ordered</li>
                )}
              </ul>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>
                <strong>Payment:</strong>{" "}
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[order.paymentStatus] || "bg-gray-200 text-gray-800"}`}>
                  {order.paymentStatus}
                </span>
              </p>
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              <p><strong>Amount:</strong> ₹{order.amount || "0"}</p>
              <p><strong>Placed:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Update Delivery Status:</label>
              <select
                value={order.deliveryStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
