import React, { useEffect, useState } from "react";
import axios from "axios";
import ComplaintTable from "../../components/ComplaintTable";
import Notifications from "../../components/Notifications";
import Sidebar from "../../components/SideBar";
import { motion } from "framer-motion";
import { useTheme } from "../../context/themeContext";

function Sdashboard() {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({ totalApplications: 0, resolvedApplications: 0 });
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  
  const role = user.role;
  const user_id=user.id;
  useEffect(() => {
    axios.get(`http://localhost:8000/api/complaint/stats/?user_id=${user_id}`) // Adjust the URL to match your Django API endpoint
      .then((response) => {
        setStats({
          totalApplications: response.data.total_applications,
          resolvedApplications: response.data.resolved_applications,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className={`flex min-h-screen w-full transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`w-64 h-screen `}>
        <Sidebar role={role} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-h-screen">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 p-6 overflow-y-auto scrollbar-hide transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <h2 className={`text-2xl font-bold mt-4 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Complaints
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[ 
              { label: "Total Applications", value: stats.totalApplications, bg: darkMode ? "bg-purple-700" : "bg-purple-500" },
              { label: "Applications Resolved", value: stats.resolvedApplications, bg: darkMode ? "bg-gray-700" : "bg-gray-600" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`${item.bg} text-white p-6 rounded-lg shadow-md transition-all duration-300`}
              >
                <h3 className="text-lg uppercase">{item.label}</h3>
                <p className="text-3xl font-bold">{item.value.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>

          {/* Complaint Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ComplaintTable />
          </motion.div>
        </motion.main>
      </div>

      {/* Notifications Panel */}
      <div className={`w-64 h-screen ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <Notifications />
      </div>
    </div>
  );
}

export default Sdashboard;
