import Sidebar from "../../components/SideBar";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import ComplaintTable from "../../components/ComplaintTable";
import Notifications from "../../components/Notifications";
import { useTheme } from "../../context/themeContext";
import { useEffect, useState } from "react";
import { useHiddenField } from "../../context/hiddenValueContext";

function Feedback() {
  const { darkMode } = useTheme();
    const { hiddenValues } = useHiddenField();
  
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  const role = user.role;
  const app_type= hiddenValues?.sideData


  // State for registered feedback
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/complaint/admin/admin_get_all_feedback_count/") // Update with actual API URL
      .then((response) => response.json())
      .then((data) => {
        setFeedbackCount(data.feedbacks);
      })
      .catch((error) => console.error("Error fetching feedback count:", error));
  }, []);

  return (
    <div className={`flex h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className="w-64 h-screen">
        <Sidebar role={role} />
      </div>

      {/* Main Content */}
      <main className={`flex-1 p-6 overflow-y-auto scrollbar-hide transition-all duration-300 ${darkMode ? "text-white" : "text-gray-700"}`}>
        <motion.h2
          className="text-2xl font-bold mt-15 pt-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Overview
        </motion.h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[
            { label: "Feedback Registered", value: feedbackCount, bg: darkMode ? "bg-purple-700" : "bg-purple-500" },
            { label: "Complaint Resolved", value: 0, bg: darkMode ? "bg-gray-700" : "bg-black" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`${item.bg} text-white p-4 rounded-lg shadow-md`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
            >
              <h3 className="text-lg">{item.label}</h3>
              <p className="text-2xl font-bold">
                <CountUp end={item.value} duration={3} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Complaint Table */}
        <motion.div
          className="mt-10 p-6 h-auto rounded-lg flex items-center justify-center transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ComplaintTable />
        </motion.div>
      </main>

      {/* Notifications Panel */}
      <div className={`w-64 h-screen ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <Notifications />
      </div>
    </div>
  );
}

export default Feedback;
