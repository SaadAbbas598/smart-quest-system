import Notifications from "../../../components/Notifications";
import Sidebar from "../../../components/SideBar";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNotification } from "../../../context/notificationContext";
import { useTheme } from "../../../context/themeContext";

function AdminChangePasswords() {
  const { darkMode } = useTheme();
  const { showNotification } = useNotification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/auth/verify-email/", { email });
      if (response.status === 200) {
        toast.success("Email verified successfully!");
        setEmailVerified(true);
      } else {
        toast.error("Email not found.");
      }
    } catch (error) {
      toast.error("An error occurred while verifying email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:8000/api/auth/reset-password/set/", {
        email,
        new_password: password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        toast.success("Password reset successful!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setEmailVerified(false);
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`flex min-h-screen mt-15 overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}> 
      <Sidebar />
      <main className="flex flex-1 items-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`p-4 rounded-xl shadow-lg w-full max-w-md border flex flex-col items-start ml-20 transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
        >
          <motion.h2 className="text-2xl font-bold mb-4">🔒 Reset Password</motion.h2>

          {!emailVerified ? (
            <div className="w-full">
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                className={`mt-1 p-2 w-full border rounded-lg shadow-sm ${darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-gray-50 border-gray-300"}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                onClick={verifyEmail}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 p-2 w-full bg-blue-500 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </motion.button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label className="block text-sm font-semibold">New Password</label>
                <input
                  type="password"
                  className="mt-1 p-2 w-full border rounded-lg"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="mt-1 p-2 w-full border rounded-lg"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 p-2 w-full bg-blue-500 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Resetting..." : "🔑 Reset Password"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </main>
      <Notifications />
    </div>
  );
}

export default AdminChangePasswords;