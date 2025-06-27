import Notifications from "../../components/Notifications";
import Sidebar from "../../components/SideBar";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/themeContext";
import axios from "axios";
import { useNotification } from "../../context/notificationContext";
import { toast } from "react-toastify";
import { useHiddenField } from "../../context/hiddenValueContext";

function Feedback() {
  const { darkMode } = useTheme();
  const { showNotification } = useNotification();
    const { hiddenValues } = useHiddenField();

  // Fetch user data from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : {};
  const role = user?.role || "";

  // Set state variables with default values from user data
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("feedback");
  const [feedbackType, setFeedbackType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Update state if user data is found later
    if (user?.username) setName(user.username);
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
  
    const feedbackData = {
      name,
      email,
      type:hiddenValues?.sideData || "feedback", // Default to "Complaint" if not specified,
      message,
      feedback_type: feedbackType,
    };
  
    try {
      const response = await axios.post("http://localhost:8000/api/feedback/create/", feedbackData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 201) {
        toast.promise(
          new Promise((resolve, reject) => {
            if (response.data.notification) {
              showNotification(response.data.notification, "info");
            }
            resolve();
          }),
          {
            pending: "Submitting your feedback...",
            success: "Feedback submitted successfully!",
            error: response.data.error || "Failed to submit feedback.",
          }
        );
        setMessage(""); // Clear message only
      } else {
        const errorMsg = response.data.error || "Failed to submit feedback.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`flex min-h-screen mt-15 overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex flex-1 items-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`p-4 rounded-xl shadow-lg w-full max-w-md border flex flex-col items-start ml-20 transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold mb-4"
          >
            ✨ Share Your Feedback
          </motion.h2>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <input type="hidden" value={type} />

            <div>
              <label className="block text-sm font-semibold">Name</label>
              <input
                type="text"
                className={`mt-1 p-2 w-full border rounded-lg shadow-sm transition text-sm ${darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-gray-50 border-gray-300"}`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                className={`mt-1 p-2 w-full border rounded-lg shadow-sm transition text-sm ${darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-gray-50 border-gray-300"}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Feedback Type</label>
              <select
                className={`mt-1 p-2 w-full border rounded-lg shadow-sm transition text-sm ${darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-gray-50 border-gray-300"}`}
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
              >
                <option value="general">General</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold">Message</label>
              <textarea
                className={`mt-1 p-2 w-full border rounded-lg shadow-sm transition text-sm ${darkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-gray-50 border-gray-300"}`}
                placeholder="Write your feedback..."
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(37, 99, 235, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`mt-1 p-2 w-full border rounded-lg shadow-sm transition text-sm ${darkMode ? "bg-blue-500 text-white" : "bg-blue-500 border-gray-300"}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "🚀 Submit Feedback"}
            </motion.button>
          </form>
        </motion.div>
      </main>

      {/* Notifications Panel */}
      <Notifications />
    </div>
  );
}

export default Feedback;
