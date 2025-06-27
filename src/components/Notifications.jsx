import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext";
import { useNotification } from "../context/notificationContext";

const Notifications = () => {
  const { darkMode } = useTheme();
  const { notification } = useNotification();

  const [notifications, setNotifications] = useState([]);
  const [news, setNews] = useState([
    "📅 New academic session starts next month",
    "🎤 University job fair happening this weekend",
    "🎓 Graduation ceremony dates announced",
    "📚 Library system upgrade completed",
  ]);
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Safe localStorage retrieval
  const userData = localStorage.getItem("user");
  let user = null;
  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage");
  }

  const userId = user?.id || null;
  const role = user?.role || "student";
  const faculty_role = user?.faculty_role || null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("New Notification:", notification);
    if (
      notification &&
      typeof notification === "object" &&
      notification.message
    ) {
      setNotifications((prev) => {
        const isDuplicate = prev.some(
          (n) => n.message === notification.message
        );
        if (isDuplicate) return prev;
        return [...prev, notification];
      });
    }
  }, [notification]);

  const removeNotification = async (index, id) => {
    const notifToRemove = notifications[index];

    if (!notifToRemove) {
      console.error("Notification not found at index:", index);
      return;
    }

    // Optimistically update UI
    setNotifications((prev) => prev.filter((_, i) => i !== index));
    console.log(id)

    try {
      let apiUrl = "";
      if (role === "faculty") {
        apiUrl = `http://localhost:8000/api/complaint/faculty-notifications/delete/${faculty_role}/`;
      } else if (role === "student" && id) {
        apiUrl = `http://localhost:8000/api/notifications/delete/${id}/`;
      } else {
        console.error("Missing required ID for deletion");
        return;
      }

      const response = await axios.delete(apiUrl);
      console.log("Notification deleted:", response.data?.message);
    } catch (error) {
      console.error(
        "Error deleting notification:",
        error.response?.data?.message || error.message
      );
    }
  };

  const removeNews = (index) => {
    setNews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed bottom-4 right-4 md:hidden w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center z-50"
        >
          <Bell size={24} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notifications.length}
            </span>
          )}
        </button>
      )}

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isOpen || !isMobile ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`w-full md:w-64 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } shadow-md h-[calc(100vh-4rem)] p-5 fixed top-16 right-0 z-40 overflow-y-auto scrollbar-hide 
        ${isMobile && !isOpen ? "hidden" : "block"}`}
      >
        <h2 className="text-lg font-bold mb-4">
          Notifications ({notifications.length})
          {console.log(notification)}
        </h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {notifications.map((notif, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg group"
              >
                <span className="text-red-500">
                  {notif.message || "No Message"}
                </span>
                <button
                  className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    removeNotification(
                      index,
                      role === "faculty"
                        ? notif.complaint_id
                        : userId
                    )
                  }
                >
                  <X size={16} />
                </button>
              </motion.li>
            ))}
          </ul>
        )}

        <h2 className="text-lg font-bold mt-6 mb-4">News</h2>
        {news.length === 0 ? (
          <p className="text-sm text-gray-500">No news available.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {news.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg group"
              >
                <span>{item}</span>
                <button
                  className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeNews(index)}
                >
                  <X size={16} />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.aside>
    </>
  );
};

export default Notifications;
