import React, { useEffect, useState } from "react";
import { Phone, MapPin, CalendarDays, Store } from "lucide-react";

const Profile = () => {
  const [shop, setShop] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");

  useEffect(() => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(randomSeed);

    const fetchShop = async () => {
      try {
        const storedPhone = localStorage.getItem("username");
        const res = await fetch(`http://localhost:5000/api/shops/${storedPhone}`);
        if (!res.ok) throw new Error("Failed to fetch shop");
        const data = await res.json();
        setShop(data);
        setShopName(data.shopName);
        setOwnerName(data.ownerName);
        setPhone(data.phone);
        setAddress(data.address);
        setLocation(data.location);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchShop();
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/shops/${shop.phone}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopName, ownerName, phone, address, location }),
      });

      if (!res.ok) throw new Error("Update failed");
      const updatedShop = await res.json();
      setShop(updatedShop);
      localStorage.setItem("phone", updatedShop.phone);
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Failed to update profile.");
    }
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <div className="flex justify-center items-center py-12 px-4">
        {shop ? (
          <div className="w-full max-w-4xl bg-white shadow-xl border border-blue-100 rounded-3xl overflow-hidden grid md:grid-cols-3">
            {/* Left Panel: Avatar */}
            <div className="p-8 flex flex-col items-center justify-center">
              <img
                className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-md"
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${avatarSeed}`}
                alt="Shop Avatar"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-800">{shop.shopName}</h2>
              <p className="text-sm text-gray-500">Owner: {shop.ownerName}</p>
              <p className="text-sm text-gray-500">Since {new Date(shop.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Right Panel: Details */}
            <div className="col-span-2 p-8">
              <h3 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-2">
                Shop Profile
              </h3>

              {message && (
                <div className="mb-4 text-sm text-green-600 font-medium">
                  {message}
                </div>
              )}

              <div className="space-y-5">
                {/* Shop Name */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <Store size={16} /> Shop:
                  </label>
                  {editMode ? (
                    <input
                      className="border border-gray-300 p-2 rounded w-full max-w-md shadow-sm"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800 pt-2">{shop.shopName}</span>
                  )}
                </div>

                {/* Owner Name */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2">Owner:</label>
                  {editMode ? (
                    <input
                      className="border border-gray-300 p-2 rounded w-full max-w-md shadow-sm"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800 pt-2">{shop.ownerName}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <Phone size={16} /> Phone:
                  </label>
                  {editMode ? (
                    <input
                      className="border border-gray-300 p-2 rounded w-full max-w-md shadow-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800 pt-2">{shop.phone}</span>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <MapPin size={16} /> Address:
                  </label>
                  {editMode ? (
                    <input
                      className="border border-gray-300 p-2 rounded w-full max-w-md shadow-sm"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800 pt-2">{shop.address}</span>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2">Location:</label>
                  {editMode ? (
                    <input
                      className="border border-gray-300 p-2 rounded w-full max-w-md shadow-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800 pt-2">{shop.location}</span>
                  )}
                </div>

                {/* Dates */}
                <div className="flex items-start gap-4">
                  <label className="w-28 text-blue-600 font-medium pt-2 flex items-center gap-2">
                    <CalendarDays size={16} /> Updated:
                  </label>
                  <span className="text-gray-800 pt-2">
                    {new Date(shop.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex gap-4">
                {editMode ? (
                  <>
                    <button
                      className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
                      onClick={() => {
                        setEditMode(false);
                        setShopName(shop.shopName);
                        setOwnerName(shop.ownerName);
                        setPhone(shop.phone);
                        setAddress(shop.address);
                        setLocation(shop.location);
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;