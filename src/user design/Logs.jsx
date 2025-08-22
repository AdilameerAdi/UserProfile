import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaTicketAlt, FaDonate, FaShoppingCart, FaSyncAlt } from "react-icons/fa";

export default function Logs() {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("coupon");

  const tabs = [
    { key: "coupon", label: "Coupon Logs", icon: <FaTicketAlt /> },
    { key: "donation", label: "Donation Logs", icon: <FaDonate /> },
    { key: "shop", label: "Shop Logs", icon: <FaShoppingCart /> },
    { key: "fortune", label: "Fortune Wheel Logs", icon: <FaSyncAlt /> },
  ];

  const tableHeaders = ["Account ID", "Coupon Code", "Redeemed On", "Redeemed At"];

  return (
    <div
      className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4"
      style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
    >
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Logs</h1>
        <p className="text-sm opacity-80">
          View all coupons redeemed, donations made, and shop transactions!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b pb-2" style={{ borderColor: theme.borderColor }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key ? "shadow-md" : "hover:opacity-80"
            }`}
            style={{
              backgroundColor: activeTab === tab.key ? theme.activeBg : "transparent",
              color: activeTab === tab.key ? theme.activeText : theme.textColor,
              border: `1px solid ${
                activeTab === tab.key ? theme.activeBorder : theme.borderColor
              }`,
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-lg shadow-md border overflow-hidden"
        style={{
          backgroundColor: theme.cardBg || theme.bgColor,
          borderColor: theme.borderColor,
        }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-4 px-4 py-3 text-sm font-semibold border-b"
          style={{ borderColor: theme.borderColor }}
        >
          {tableHeaders.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FaTicketAlt className="text-gray-500 text-4xl mb-3" />
          <h3 className="text-lg font-semibold mb-1">No coupon logs found</h3>
          <p className="text-sm opacity-80">You haven&apos;t used any coupons yet</p>
        </div>
      </div>
    </div>
  );
}
