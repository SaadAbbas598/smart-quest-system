import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext";
import axios from "axios";

function ApplicationForm({ id }) {
  const { darkMode } = useTheme();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/complaint/get_application/${id}/`
        );
        setApplication(response.data);
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  if (!application) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mx-auto mt-16 md:mt-24 max-w-8xl w-full sm:w-11/12 md:w-3/4 lg:w-2/3 p-6 sm:p-8 border-2 border-gray-300 rounded-lg shadow-lg ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6"
      >
        {application.title || "One-Day Leave Application for School"}
      </motion.h2>
      <motion.p>To,</motion.p>
      <motion.p className="font-semibold">The Principal,</motion.p>
      <motion.p>
        {application.school_address || "[Address of the school]"}
      </motion.p>
      <motion.p>{application.date || "[Present Date]"}</motion.p>
      <motion.p className="mt-4 font-semibold">
        Subject: {application.subject || "Leave application for one day"}
      </motion.p>
      <motion.p className="mt-4">Sir/Madam,</motion.p>
      <motion.p className="mt-2">
        {application.content ||
          "I am a student of [class and section] at your school. I need leave for one day due to personal reasons."}
      </motion.p>
      <motion.p className="mt-4">Thanking you,</motion.p>
      <motion.p className="mt-2">Yours obediently,</motion.p>
      <motion.p>{application.student_name || "[Name of the Student]"}</motion.p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <motion.p>{application.department || "[Roll No]"}</motion.p>
          <motion.span>{application.session || "[Roll No]"}</motion.span>
        </div>
        <motion.span>{application.date || "[Date]"}</motion.span>
      </div>
    </motion.div>
  );
}

export default ApplicationForm;
