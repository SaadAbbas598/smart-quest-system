import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/SideBar";
import BarChart from "./BarChat";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import Notifications from "../../components/Notifications";
import { useTheme } from "../../context/themeContext";

function Dashboard() {
  const { darkMode } = useTheme();
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  const role = user.role;

  const [stats, setStats] = useState({
    complaintsRegistered: 0,
    complaintsResolved: 0,
    requestsDone: 0,
    requestResponses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/complaint/admin/admin_get_all_complaints/");
        
        if (response.data) {
          setStats({
            complaintsRegistered: response.data. total_application_complaint|| 0,
            complaintsResolved: response.data.total_complaint_resolved_application || 0,
            requestsDone: response.data.total_request_resolved_application || 0,
            requestResponses: response.data.total_application_request || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      }
    };
  
    fetchStats();
  }, []);
  

  return (
    <div className={`flex h-screen p-4 overflow-hidden transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Sidebar */}
      <div className="w-64 h-screen">
        <Sidebar role={role} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto scrollbar-hide">
        <motion.h2
          className="text-2xl font-bold mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Overview
        </motion.h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[
            { label: "Complaints Registered", value: stats.complaintsRegistered, bg: "bg-purple-500" },
            { label: "Complaints Resolved", value: stats.complaintsResolved, bg: "bg-black" },
            { label: "Requests Done", value: stats.requestsDone, bg: "bg-black" },
            { label: "Request Responses", value: stats.requestResponses, bg: "bg-purple-500" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`${item.bg} text-white p-4 rounded-lg`}
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

        {/* Bar Chart Placeholder */}
        <motion.div
          className="mt-10 bg-gray-300 p-6 h-[500px] rounded-lg flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BarChart />
        </motion.div>
      </main>

      {/* Notifications Panel */}
      <div className="w-64 h-screen">
        <Notifications />
      </div>
    </div>
  );
}

export default Dashboard;