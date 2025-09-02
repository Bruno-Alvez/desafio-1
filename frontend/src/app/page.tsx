"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Product List",
    "Inventory Management",
    "Sales Performance",
    "Marketing",
    "Customer Feedback",
  ];

  const metrics = [
    {
      title: "Total Products",
      value: "586",
      change: "+5 products from last month",
      changeType: "positive",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-cube text-purple-600"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" x2="12" y1="22.08" y2="12"></line>
        </svg>
      ),
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2 star from last month",
      changeType: "positive",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-star text-purple-600"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
    },
    {
      title: "Sales Trends",
      value: "",
      change: "+16.8% from last month",
      changeType: "positive",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-trending-up text-purple-600"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      ),
      chart: (
        <div className="w-full h-8 flex items-end justify-center space-x-1">
          {[3, 5, 2, 6, 4, 7, 3, 5, 6, 4, 8, 5].map((height, index) => (
            <div
              key={index}
              className="bg-purple-600 rounded-sm"
              style={{ height: `${height * 3}px`, width: "4px" }}
            ></div>
          ))}
        </div>
      ),
    },
    {
      title: "Low Stock",
      value: "5 products",
      change: "are under 50 items",
      changeType: "negative",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-alert-triangle text-purple-600"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
      ),
    },
  ];

  const activities = [
    {
      product: { name: "Linen Shirt", image: "👕" },
      activityType: "Stock Adjustment",
      details: "Stock adjusted from 100 to 90 units after bulk order.",
      date: "June 29, 2024",
      type: "stock",
    },
    {
      product: { name: "Jeans Jacket", image: "🧥" },
      activityType: "New Product",
      details: "Price: $65.00, Stock: 70 units",
      date: "June 28, 2024",
      type: "new",
    },
    {
      product: { name: "Cotton T-Shirt", image: "👕" },
      activityType: "Customer Review",
      details: '"Great quality and fit." Rating: 5 stars',
      date: "June 28, 2024",
      type: "review",
    },
    {
      product: { name: "Denim Shorts", image: "🩳" },
      activityType: "Product Update",
      details: "Updated description and added new color variants.",
      date: "June 27, 2024",
      type: "update",
    },
    {
      product: { name: "Summer Dress", image: "👗" },
      activityType: "Promotion",
      details: "Added to summer sale with 20% discount.",
      date: "June 26, 2024",
      type: "promotion",
    },
    {
      product: { name: "Old Collection", image: "📦" },
      activityType: "Deletion",
      details: "Removed outdated items from inventory.",
      date: "June 25, 2024",
      type: "deletion",
    },
  ];

  const getActivityTypeColor = (type: string) => {
    const colors = {
      stock: "bg-purple-100 text-purple-800",
      new: "bg-green-100 text-green-800",
      review: "bg-orange-100 text-orange-800",
      update: "bg-blue-100 text-blue-800",
      promotion: "bg-pink-100 text-pink-800",
      deletion: "bg-red-100 text-red-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {metric.icon}
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-more-vertical text-gray-400"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                {metric.title}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </span>
                {metric.chart && <div className="flex-1">{metric.chart}</div>}
              </div>
              <p
                className={`text-sm ${
                  metric.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activities
          </h2>
        </div>

        {/* Table Toolbar */}
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search absolute left-3 top-2.5 text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="absolute right-3 top-2 text-xs text-gray-400">
                ⌘S
              </span>
            </div>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-filter mr-2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option>50 data</option>
              <option>25 data</option>
              <option>100 data</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Product</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-up-down text-gray-400"
                    >
                      <path d="m21 16-4 4-4-4"></path>
                      <path d="M17 20V4"></path>
                      <path d="m3 8 4-4 4 4"></path>
                      <path d="M7 4v16"></path>
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Activity Type</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-up-down text-gray-400"
                    >
                      <path d="m21 16-4 4-4-4"></path>
                      <path d="M17 20V4"></path>
                      <path d="m3 8 4-4 4 4"></path>
                      <path d="M7 4v16"></path>
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar text-gray-400"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                      <line x1="16" x2="16" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="2" y2="6"></line>
                      <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                    <span>Date</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-up-down text-gray-400"
                    >
                      <path d="m21 16-4 4-4-4"></path>
                      <path d="M17 20V4"></path>
                      <path d="m3 8 4-4 4 4"></path>
                      <path d="M7 4v16"></path>
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Action</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-more-vertical text-gray-400"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg mr-3">
                        {activity.product.image}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {activity.product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActivityTypeColor(
                        activity.type
                      )}`}
                    >
                      {activity.activityType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {activity.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-more-vertical text-gray-400"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}