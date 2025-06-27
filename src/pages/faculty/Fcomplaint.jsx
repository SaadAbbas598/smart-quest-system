import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Sidebar from "../../components/SideBar";
import ComplaintTable from "../../components/ComplaintTable";
import Notifications from "../../components/Notifications";
import { useTheme } from "../../context/themeContext";
import axios from "axios";

const FComplaint = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({ total: 0, resolved: 0 });

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null; // Parse userData safely
  const faculty_role = user ? user.faculty_role : ""; // Ensure faculty_role is not undefined
  const role = user ? user.role : ""; // Ensure role is not undefined

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/complaint/complaint_faculty_stats/?faculty_role=${faculty_role}`)
      .then((response) => {
        setStats({
          total: response.data.total_complaint, // Use correct keys
          resolved: response.data.resolved_complaint,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [faculty_role]); // Dependency to refetch when faculty_role changes

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className="w-64 h-screen">
        <Sidebar role={role} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto scrollbar-hide">
        <h2 className="text-2xl font-bold mt-15 pt-5">Requests</h2>

        {/* Stats Cards with CountUp and Animation */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-purple-500 text-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg uppercase">Total Complaints</h3>
            <p className="text-3xl font-bold">
              <CountUp start={0} end={stats.total} duration={2} separator="," />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-black text-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg uppercase">Complaints Resolved</h3>
            <p className="text-3xl font-bold">
              <CountUp start={0} end={stats.resolved} duration={2} separator="," />
            </p>
          </motion.div>
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
      <div className="w-64 h-screen">
        <Notifications />
      </div>
    </div>
  );
};

export default FComplaint;
