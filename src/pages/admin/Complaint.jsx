import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import ComplaintTable from "../../components/ComplaintTable";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import Notifications from "../../components/Notifications";
import { useTheme } from "../../context/themeContext";
import axios from "axios";
import { useHiddenField } from "../../context/hiddenValueContext";

const Complaint = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { hiddenValues } = useHiddenField();
  
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  const role = user.role;
  const app_type= hiddenValues?.sideData

  const [complaintsData, setComplaintsData] = useState({
    total_complaints: 0,
    resolved_complaints: 0,
  });

  useEffect(() => {
    const fetchComplaintStats = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/complaint/admin/admin_get_all_complaints_by_app_type/${app_type}/`);
        setComplaintsData({
          total_complaints: response.data.total_app,
          resolved_complaints: response.data.resolved_app,
        });
      } catch (error) {
        console.error("Error fetching complaint stats:", error);
      }
    };

    fetchComplaintStats();
  }, []);

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div className={`w-64 h-screen `}>
        <Sidebar role={role} />
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 overflow-y-auto scrollbar-hide transition-all duration-300 
        ${darkMode ? "text-white" : "text-gray-700"}`}
      >
        <motion.h2
          className={`text-2xl font-bold mt-15 pt-5 ${darkMode ? "text-white" : "text-gray-700"}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Complaints
        </motion.h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {[{
              label: "Total Complaints",
              value: complaintsData.total_complaints,
              bg: darkMode ? "bg-purple-700" : "bg-purple-500",
            },
            {
              label: "Complaint Resolved",
              value: complaintsData.resolved_complaints,
              bg: darkMode ? "bg-gray-700" : "bg-black",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`${item.bg} text-white p-6 rounded-lg shadow-md`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-lg">{item.label}</h3>
              <p className="text-3xl font-bold">
                <CountUp end={item.value} duration={2} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Complaint Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
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
};

export default Complaint;