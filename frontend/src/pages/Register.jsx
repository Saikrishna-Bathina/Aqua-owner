import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    address: "",
    location: "",
    password: "",
    confirmPassword: "",
    stock: {
      waterTins: false,
      coolingWaterTins: false,
      waterBottles: false,
      waterPackets: false,
    },
  });

  const [shopImage, setShopImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.stock) {
      setFormData((prev) => ({
        ...prev,
        stock: {
          ...prev.stock,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setShopImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match")
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("shopImage", shopImage);
      data.append("shopName", formData.shopName);
      data.append("ownerName", formData.ownerName);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("location", formData.location);
      data.append("password", formData.password);
      data.append("confirmPassword", formData.confirmPassword);

      Object.entries(formData.stock).forEach(([key, value]) => {
        data.append(`stock[${key}]`, value);
      });

      const res = await fetch(`${API_BASE_URL}/api/owner/register`, {
        method: "POST",
        body: data,
      });
      console.log(data)

      const result = await res.json();

      if (res.status === 201) {
        toast.success("Shop registered successfully");
        // Reset form or redirect
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-10 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo.jpg"
            alt="Shop Logo"
            className="w-52 h-auto rounded-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/300x150/ADD8E6/000000?text=Water+Logo";
            }}
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register Shop
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Inputs */}
          {[
            { label: "Shop Name", name: "shopName" },
            { label: "Owner Name", name: "ownerName" },
            { label: "Phone Number", name: "phone" },
            { label: "Address", name: "address" },
            { label: "Location", name: "location" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full"
            />
          </div>

          {/* Password Fields */}
          {["password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === "confirmPassword" ? "Confirm Password" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          ))}

          {/* Stock Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Available:
            </label>
            <div className="space-y-2">
              {[
                { label: "Water Tins", name: "waterTins" },
                { label: "Cooling Water Tins", name: "coolingWaterTins" },
                { label: "Water Bottles", name: "waterBottles" },
                { label: "Water Packets", name: "waterPackets" },
              ].map((item) => (
                <div className="flex items-center" key={item.name}>
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={formData.stock[item.name]}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4"
                  />
                  <label className="text-gray-700">{item.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
