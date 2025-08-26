import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../signup/AuthContext";

export default function RecoveryEmailReminder({ onDismiss }) {
  const { theme } = useContext(ThemeContext);
  const { updateRecoveryEmail, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddRecoveryEmail = async () => {
    if (!email.trim()) {
      alert("Please enter a valid email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address");
      return;
    }

    setSaving(true);
    try {
      const result = await updateRecoveryEmail(email.trim());
      
      if (result.ok) {
        // Permanently mark that this user has completed recovery email setup
        const completedKey = `recovery_email_completed_${currentUser.id}`;
        localStorage.setItem(completedKey, 'true');
        
        alert("Recovery email added successfully! You can now use it as a backup login method.");
        onDismiss();
      } else {
        alert("Failed to add recovery email: " + result.error);
      }
    } catch (error) {
      alert("Failed to add recovery email: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="mb-4 p-4 rounded-lg border-l-4 shadow-sm"
      style={{ 
        backgroundColor: theme.bgColor, 
        borderColor: theme.activeBorder,
        border: `1px solid ${theme.borderColor}`
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">🔐</span>
            <h3 
              className="text-lg font-semibold"
              style={{ color: theme.textColor }}
            >
              Secure Your Account
            </h3>
          </div>
          
          <p 
            className="mb-3 text-sm leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            Add a recovery email to secure your account. If you ever have trouble logging in with your primary email, you can use your recovery email as a backup.
          </p>
          
          {!showForm ? (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-sm rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: theme.buttonColor,
                  color: theme.buttonTextColor
                }}
              >
                Add Recovery Email
              </button>
              
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-sm rounded-lg font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'transparent',
                  color: theme.textSecondary,
                  border: `1px solid ${theme.borderColor}`
                }}
              >
                Maybe Later
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Enter recovery email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.inputBg || theme.bgColor,
                    borderColor: theme.borderColor,
                    color: theme.textColor,
                    focusRingColor: theme.activeBorder
                  }}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleAddRecoveryEmail}
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: theme.buttonColor,
                    color: theme.buttonTextColor
                  }}
                >
                  {saving ? "Adding..." : "Add Recovery Email"}
                </button>
                
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEmail("");
                  }}
                  className="px-4 py-2 text-sm rounded-lg font-medium transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.textSecondary,
                    border: `1px solid ${theme.borderColor}`
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={onDismiss}
          className="ml-4 p-1 rounded hover:opacity-70 transition-opacity"
          style={{ color: theme.textSecondary }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}