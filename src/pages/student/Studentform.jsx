import { useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiUser,
  FiEdit,
  FiCalendar,
  FiFileText,
  FiUpload,
  FiSend,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notifications from "../../components/Notifications";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/SideBar";
import { useTheme } from "../../context/themeContext";
import { useNotification } from "../../context/notificationContext";
import { useHiddenField } from "../../context/hiddenValueContext";

function ComplaintForm() {
  const { darkMode } = useTheme();
  const { showNotification } = useNotification();
  const { hiddenValues } = useHiddenField();
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  const username = user.username;
  const role = user.role;

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: username,
    title: "",
    department: "",
    session: "",
    category: "",
    date: getTodayDate(), // Always set to today's date
    description: "",
    file: null,
    app_type: hiddenValues?.sideData || "Complaint", // Default to "Complaint" if not specified
  });

  const [notifications, setNotifications] = useState([]);

  const departments = [
    "Electrical",
    "Mechanical",
    "Computer Science",
    "Others",
  ];
  const sessions = ["2021", "2022", "2023", "2024"];
  const categories = ["Hostel", "Acadamic", "Library", "Others"];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get JWT token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Authentication required! Please log in.");
      return;
    }

    const complaintData = new FormData();
    complaintData.append("name", formData.name);
    complaintData.append("title", formData.title);
    complaintData.append("department", formData.department);
    complaintData.append("session", formData.session);
    complaintData.append("category", formData.category);
    complaintData.append("date", formData.date); // Will always be today's date
    complaintData.append("description", formData.description);
    complaintData.append("app_type", formData.app_type);

    if (formData.file) {
      complaintData.append("file", formData.file);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/complaint/create/",
        complaintData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        if (data.status === "success") {
          toast.success(
            data.message || `${formData.app_type} submitted successfully!`
          );
          if (data.notification) {
            showNotification(data.notification, "info");
          }

          // Reset form but keep today's date
          setFormData({
            name: username,
            title: "",
            department: "",
            session: "",
            category: "",
            date: getTodayDate(),
            description: "",
            file: null,
            app_type: hiddenValues?.sideData || "Complaint",
          });
        } else {
          const errorMsg =
            data.error ||
            `Failed to submit ${formData.app_type.toLowerCase()}.`;
          if (typeof errorMsg === "object") {
            Object.values(errorMsg).forEach((err) => {
              toast.error(err.toString());
            });
          } else {
            toast.error("Error: " + errorMsg);
          }
        }
      } else {
        toast.error("Server responded with an error: " + response.status);
      }
    } catch (error) {
      console.error(
        `Error submitting ${formData.app_type.toLowerCase()}:`,
        error
      );

      if (error.response) {
        const errorData = error.response.data;
        if (errorData.error) {
          toast.error("Error: " + errorData.error);
        } else if (errorData.detail) {
          toast.error("Authentication error: " + errorData.detail);
        } else {
          toast.error("Unexpected error occurred");
        }
      } else if (error.request) {
        toast.error("Network error: Please check your internet connection.");
      } else {
        toast.error("Error: " + error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } overflow-hidden font-poppins mt-12`}
    >
      <Navbar />
      <div className="w-64 h-screen">
        <Sidebar role={role} />
      </div>
      <motion.div
        className="flex-1 pl-16 flex flex-col h-full overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 overflow-y-auto flex-1">
          <h2
            className={`text-2xl font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {formData.app_type} Form
          </h2>
          <p
            className={`mb-5 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {hiddenValues?.sideData === "Complaint" ? (
              <>
                This is the form to submit various types of complaints, such as
                academic or facility-related issues. You can file a complaint
                regarding issues like unaddressed concerns, inadequate
                facilities, or any grievances you wish to bring to attention.
              </>
            ) : hiddenValues?.sideData === "Request" ? (
              <>
                This is the form to submit various types of requests, such as
                event permission requests. You can request approval to host a
                student event, outlining details like the event's purpose, date,
                location, and expected attendance.
              </>
            ) : null}
          </p>

          <motion.div
            className={`p-6 shadow-lg rounded-xl w-full max-w-2xl ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <InputHiddenField
                    value={formData.app_type}
                    name="app_type"
                    onChange={handleChange}
                  />
                  <InputField
                    label="Name"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                    icon={<FiUser />}
                    darkMode={darkMode}
                  />
                  <InputField
                    label={`${formData.app_type} Title`}
                    placeholder={`Enter ${formData.app_type.toLowerCase()} title`}
                    value={formData.title}
                    name="title"
                    required
                    onChange={handleChange}
                    icon={<FiEdit />}
                    darkMode={darkMode}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Department"
                      options={departments}
                      value={formData.department}
                      name="department"
                      required
                      onChange={handleChange}
                      darkMode={darkMode}
                    />
                    <SelectField
                      label="Session"
                      options={sessions}
                      value={formData.session}
                      name="session"
                      required
                      onChange={handleChange}
                      darkMode={darkMode}
                    />
                  </div>
                  <SelectField
                    label="Category"
                    options={categories}
                    value={formData.category}
                    name="category"
                    required
                    onChange={handleChange}
                    darkMode={darkMode}
                  />
                  <InputField
                    label="Date"
                    type="date"
                    value={formData.date}
                    name="date"
                    required
                    onChange={handleChange}
                    icon={<FiCalendar />}
                    darkMode={darkMode}
                    readOnly
                  />
                </div>
                <div className="space-y-4">
                  <TextAreaField
                    label={`${formData.app_type} Description`}
                    placeholder={`Describe your ${formData.app_type.toLowerCase()}...`}
                    value={formData.description}
                    name="description"
                    required
                    onChange={handleChange}
                    icon={<FiFileText />}
                    rows={11}
                    darkMode={darkMode}
                  />
                  <FileUploadField
                    label="Attachment"
                    icon={<FiUpload />}
                    darkMode={darkMode}
                    onChange={handleChange}
                    name="file"
                    value={formData.file}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  label="Cancel"
                  className={`${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-gray-300 hover:bg-gray-400"
                  } text-white`}
                  type="button"
                />
                <Button
                  label="Submit"
                  className="bg-[#00A4C4] text-white hover:bg-[#008CBA]"
                  icon={<FiSend />}
                  type="submit"
                />
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

// Reusable Components (keep these the same as in your original code)
// ... [rest of the component code remains unchanged]
const InputHiddenField = ({ value, name, onChange }) => (
  <input type="hidden" value={value} name={name} onChange={onChange} />
);

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  name,
  onChange,
  icon,
  darkMode,
  required,
  readOnly = false,
}) => {
  const handleDateChange = (e) => {
    if (type === "date") {
      // Prevent changing the date
      toast.info("Date is automatically set to today");
      return;
    }
    onChange(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label
        className={`block text-sm font-medium ${
          darkMode ? "text-white" : "text-gray-700"
        } mb-1`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2 border ${
            darkMode
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-gray-900"
          } rounded-lg shadow-sm focus:ring-2 focus:ring-[#00A4C4] ${
            type === "date"
              ? "cursor-not-allowed bg-gray-200 dark:bg-gray-600"
              : ""
          }`}
          value={value}
          name={name}
          onChange={handleDateChange}
          required={required}
          readOnly={readOnly || type === "date"}
        />
      </div>
    </motion.div>
  );
};

const SelectField = ({
  label,
  options,
  value,
  name,
  onChange,
  darkMode,
  required,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <label
      className={`block text-sm font-medium ${
        darkMode ? "text-white" : "text-gray-700"
      } mb-1`}
    >
      {label}
    </label>
    <select
      className={`w-full p-2 border ${
        darkMode
          ? "border-gray-600 bg-gray-700 text-white"
          : "border-gray-300 bg-white text-gray-900"
      } rounded-lg focus:ring-2 focus:ring-[#00A4C4]`}
      value={value}
      name={name}
      onChange={onChange}
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </motion.div>
);

const TextAreaField = ({
  label,
  placeholder,
  value,
  name,
  onChange,
  icon,
  rows = 4,
  darkMode,
  required,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <label
      className={`block text-sm font-medium ${
        darkMode ? "text-white" : "text-gray-700"
      } mb-1`}
    >
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div
          className={`absolute inset-y-0 left-0 pl-3 pt-3 flex items-start ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {icon}
        </div>
      )}
      <textarea
        className={`w-full pl-10 pr-4 py-2 border ${
          darkMode
            ? "border-gray-600 bg-gray-700 text-white"
            : "border-gray-300 bg-white text-gray-900"
        } rounded-lg shadow-sm focus:ring-2 focus:ring-[#00A4C4]`}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        rows={rows}
        required={required}
      />
    </div>
  </motion.div>
);

const FileUploadField = ({ label, icon, darkMode, onChange, name, value }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label
        className={`block text-sm font-medium ${
          darkMode ? "text-white" : "text-gray-700"
        } mb-1`}
      >
        {label}
      </label>
      <div
        className={`flex items-center justify-between border ${
          darkMode
            ? "border-gray-600 bg-gray-700 text-white"
            : "border-gray-300 bg-white text-gray-900"
        } p-2 rounded-lg cursor-pointer hover:bg-gray-200`}
        onClick={handleClick}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{value ? value.name : "Upload File"}</span>
        </div>
        {value && (
          <span className="text-sm text-gray-500">
            {Math.round(value.size / 1024)} KB
          </span>
        )}
        <input
          type="file"
          className="hidden"
          name={name}
          onChange={onChange}
          ref={fileInputRef}
        />
      </div>
    </motion.div>
  );
};

const Button = ({ label, className, icon, type = "button" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-2 rounded-lg shadow ${className} flex items-center gap-2`}
    type={type}
  >
    {icon} {label}
  </motion.button>
);

export default ComplaintForm;
