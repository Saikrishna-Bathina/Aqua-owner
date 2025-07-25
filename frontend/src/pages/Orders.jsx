import React, { useEffect, useState } from "react";
import { Phone, User, MapPin } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

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
      setOrders(data.orders || []);
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

      if (!response.ok) throw new Error("Failed to update delivery status");

      fetchOrders();
    } catch (err) {
      console.error(err.message);
      setError("Failed to update delivery status");
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Dispatched: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-gray-200 text-gray-800",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

      {error && (
        <div className="text-red-600 text-sm mb-4">Error: {error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg border border-gray-200 transition duration-200 flex flex-col justify-between"
          >
            {/* Customer Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User size={16} />
                {order.customerName}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                {order.phoneNumber}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                {order.userAddress}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-3 rounded-lg border mb-4">
              <p className="font-medium text-gray-800 mb-2">Items Ordered</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                {order.orderItems?.waterTins > 0 && <li>Water Tins: {order.orderItems.waterTins}</li>}
                {order.orderItems?.coolingWaterTins > 0 && <li>Cooling Tins: {order.orderItems.coolingWaterTins}</li>}
                {order.orderItems?.waterBottles > 0 && <li>Water Bottles: {order.orderItems.waterBottles}</li>}
                {order.orderItems?.waterPackers > 0 && <li>Water Packers: {order.orderItems.waterPackers}</li>}
                {Object.values(order.orderItems || {}).every((q) => q === 0) && (
                  <li className="text-gray-400 italic">No items ordered</li>
                )}
              </ul>
            </div>

            {/* Order Info & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-gray-500">
                Order ID: <span className="text-gray-700">#{order._id.slice(-6)}</span><br />
                <span>Placed on: {new Date(order.createdAt).toLocaleString()}</span>
              </p>

              <select
                value={order.deliveryStatus}
                disabled={order.deliveryStatus === "Cancelled"}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (newStatus === "Cancelled") {
                    setPendingStatusChange({
                      orderId: order._id,
                      previousStatus: order.deliveryStatus,
                    });
                    setShowConfirmModal(true);
                  } else {
                    handleStatusChange(order._id, newStatus);
                  }
                }}
                className={`text-xs font-semibold rounded-full px-4 py-2 border-none outline-none cursor-pointer ${statusColors[order.deliveryStatus]}`}
              >
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Cancel Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-3">Cancel Order?</h2>
            <p className="mb-5 text-gray-600">Are you sure you want to cancel this order? This cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  handleStatusChange(pendingStatusChange.orderId, "Cancelled");
                  setShowConfirmModal(false);
                }}
              >
                Yes, Cancel
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={() => {
                  setPendingStatusChange(null);
                  setShowConfirmModal(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
