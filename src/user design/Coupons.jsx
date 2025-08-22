import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaInfoCircle, FaTicketAlt, FaBoxOpen } from "react-icons/fa";

export default function Coupons() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-4"
      style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
    >
      {/* About Coupons */}
      <div
        className="rounded-lg p-6 shadow-md border"
        style={{
          backgroundColor: theme.cardBg || theme.bgColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FaInfoCircle className="text-blue-400 text-xl" />
          <h2 className="text-xl font-bold">About Coupons</h2>
        </div>
        <p className="text-sm mb-4 opacity-80">Learn how to claim and use coupon codes</p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Coupons are special</strong> are special codes that you can redeem to receive Olympus Coins or valuable in-game items.
          </li>
          <li>
            <strong>Olympus Coins are</strong> automatically credited to your account balance upon redemption.
          </li>
          <li>
            <strong>Items are stored in</strong> your coupon inventory where you can choose which character to send them to.
          </li>
        </ul>
      </div>

      {/* Claim Coupon */}
      <div
        className="rounded-lg p-6 shadow-md border"
        style={{
          backgroundColor: theme.cardBg || theme.bgColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FaTicketAlt className="text-blue-400 text-xl" />
          <h2 className="text-lg font-bold">Claim Coupon</h2>
        </div>
        <p className="text-sm opacity-80 mb-4">Enter your coupon code to redeem rewards</p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter coupon's code"
            className="flex-1 px-4 py-2 rounded-md text-sm outline-none"
            style={{
              backgroundColor: theme.inputBg || "#111827",
              color: theme.textColor,
              border: `1px solid ${theme.borderColor}`,
            }}
          />
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all"
            style={{
              backgroundColor: theme.primaryButton || "#3b82f6",
              color: "#fff",
            }}
          >
            <FaTicketAlt />
            Claim a coupon
          </button>
        </div>
        <p className="text-xs mt-2 opacity-70">
          Coupon codes are case-sensitive and can only be used once per account
        </p>
      </div>

      {/* Coupon Inventory */}
      <div
        className="rounded-lg p-6 shadow-md border flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: theme.cardBg || theme.bgColor,
          borderColor: theme.borderColor,
        }}
      >
        <FaBoxOpen className="text-gray-500 text-4xl mb-3" />
        <h3 className="text-lg font-semibold mb-1">No coupons available</h3>
        <p className="text-sm opacity-80">
          You don’t have any coupons in your inventory yet. Claim a coupon to see it here.
        </p>
      </div>
    </div>
  );
}
