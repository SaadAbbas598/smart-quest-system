import React, { useState, useEffect } from "react";
import axios from "axios";
import { TablePagination } from "@mui/material";
import { ChevronDown } from "lucide-react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTheme } from "../context/themeContext";
import { useHiddenField } from "../context/hiddenValueContext";
import { useNotification } from "../context/notificationContext";
import { useNavigate } from "react-router-dom";

const ComplaintTable = () => {
  const { darkMode } = useTheme();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [userRole, setUserRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPopupOpen, setEditPopupOpen] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const { hiddenValues } = useHiddenField();
  const { showNotification } = useNotification();
  
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);
  const role = user.role;
  const user_id = user.id;
  const app_type = hiddenValues?.sideData;
  const [hasFetched, setHasFetched] = useState(false);  // Track if notifications have been fetched
  const [notificationFetched, setNotificationFetched] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch escalated complaints (always called)
        const escalateRes = await axios.get(
          "http://localhost:8000/api/eascalate/complaints/escalate/"
        );
  
        if (escalateRes.data.status === "success" && escalateRes.data.notification) {
          showNotification(escalateRes.data.notification, "info");
        }
  
        // 2. Fetch faculty notifications (only if user is faculty)
        if (user.role === "faculty") {
          const notificationRes = await axios.get(
            `http://localhost:8000/api/complaint/messages/get/${user.faculty_role}`
          );
  
          if (
            notificationRes.data.notifications &&
            notificationRes.data.notifications.length > 0
          ) {
            notificationRes.data.notifications.forEach((notif) => {
              showNotification(notif.message, "info");
              // console.log(notif);
            });
          }
        }
  
        setHasFetched(true); // Ensure this only happens once
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (app_type !== "feedback" && !hasFetched) {
      fetchData();
    }
  }, [hasFetched]);
  

 // Dependency on `hasFetched` to prevent multiple calls

  const fetchData = async () => {
    const baseUrl = "http://localhost:8000/api";
    let url = "";
  
    try {
      setUserRole(role);
      const faculty_role = user.faculty_role;
      
      if (role === "faculty" && faculty_role) {
        if (app_type === "feedback") {
          url = `${baseUrl}/feedback/get_by_role/${faculty_role}/`;
        } else {
          url = app_type
            ? `${baseUrl}/complaint/get_complaints_by_role/${faculty_role}/${app_type}/`
            : `${baseUrl}/complaint/get_all_complaints_by_role/${faculty_role}/`;
        }
      } else if (role === "student") {
        url = app_type === "feedback" 
          ? `${baseUrl}/feedback/student/${user_id}/`
          : `${baseUrl}/complaint/student/`;
      } else if (role === "admin") {
        if (app_type === "feedback") {
          url = `${baseUrl}/complaint/admin/admin_get_all_feedback/${app_type}`;
        } else {
          url = app_type
            ? `${baseUrl}/complaint/admin/admin_get_all_complaints/${app_type}/`
            : `${baseUrl}/complaint/admin/admin_get_all_complaints/`;
        }
      } else {
        console.error("Unknown role:", role);
        return;
      }
  
      const response = await axios.get(`${url}?user_id=${user_id}`);
      let responseData = response.data.feedback || response.data.complaints || response.data.feedbacks || response.data;
      
      // Ensure responseData is an array
      if (!Array.isArray(responseData)) {
        responseData = responseData.feedback ? [responseData.feedback] : [responseData];
      }
  
      const validatedData = responseData.map(item => {
        if (app_type === "feedback") {
          return {
            id: item.id || 'N/A',
            name: item.name || 'N/A',
            feedback_type: item.feedback_type || item.type || 'N/A', // Changed to look for 'type' as well
            message: item.message || 'N/A',
            type: item.type || 'N/A'
          };
        } else {
          return {
            id: item.id || 'N/A',
            title: item.title || 'N/A',
            date: item.date || new Date().toISOString(),
            session: item.session || 'N/A',
            status: item.status || 'Pending'
          };
        }
      });
  
      setRequests(validatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [app_type]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPage(0);
    setIsFilterDropdownOpen(false);
  };

  const handleDelete = async (requestId) => {
    try {
      const endpoint = app_type === "feedback"
        ? `http://localhost:8000/api/feedback/delete/${requestId}/`
        : `http://localhost:8000/api/complaint/delete_application/${requestId}/`;

      await axios.delete(endpoint);
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      showNotification(
        app_type === "feedback" ? "Feedback deleted successfully" : "Complaint deleted successfully",
        "success"
      );
    } catch (error) {
      console.error("Error deleting:", error);
      showNotification("Failed to delete", "error");
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/notifications/${user.id}/`);
      
      if (response.data.status === "success") {
        if (response.data.messages) {
          console.log("Notifications:", response.data.messages);
          showNotification(response.data.messages);
        } else {
          console.log("No notifications found.");
        }
      }
      setHasFetched(true);  // Mark as fetched once notifications are successfully fetched
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  useEffect(() => {
    if (!hasFetched) {  // Only fetch notifications once
      fetchNotifications();
    }
  }, [hasFetched]);  // This useEffect will only run once
  
  const handleStatusChange = async (requestId) => {
    try {
      if (app_type === "feedback") {
        showNotification("Cannot change status for feedback items", "warning");
        return;
      }
  
      if (!selectedStatus) {
        console.error("Status not selected");
        return;
      }
  
      const faculty_role = user.faculty_role;
  
      const response = await axios.put(
        `http://localhost:8000/api/complaint/update_status/${requestId}/`,
        { status: selectedStatus, faculty_role: faculty_role }
      );
  
      if (response.data.status === "success") {
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === requestId ? { ...req, status: selectedStatus } : req
          )
        );
        setEditPopupOpen(null);
        showNotification("Status updated successfully", "success");
      } else {
        showNotification("Failed to update status", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification("Error updating status", "error");
    }
  };
  const toggleEditPopup = (requestId) => {
    if (app_type === "feedback") return;
    
    setEditPopupOpen(prevId => (prevId === requestId ? null : requestId));
    const currentRequest = requests.find(req => req.id === requestId);
    if (currentRequest) {
      setSelectedStatus(currentRequest.status || "Pending");
    }
  };

  const handleTitleClick = (request) => {
    if (app_type === "feedback") {
      navigate(`/feedback/${request.id}`);
    } else {
      navigate(`/application-form/${request.id}`);
    }
  };

  const filteredRequests = filterStatus === "All"
    ? requests
    : requests.filter(req => app_type === "feedback" ? true : req.status === filterStatus);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="w-full mt-5">
      <div className={`w-full p-6 rounded-lg shadow-2xl ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-3">
          <h2 className="text-lg font-semibold mb-2 md:mb-0">
            {app_type === "feedback" ? "Feedback Overview" : "Application Overview"}
          </h2>

          {app_type !== "feedback" && (
            <div className="relative">
              <button
                className={`flex items-center justify-between px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition ${
                  darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }`}
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              >
                {filterStatus} <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              {isFilterDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-40 shadow-lg rounded-lg overflow-hidden ${
                  darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }`}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-blue-100"
                    onClick={() => handleFilterChange("All")}
                  >
                    All
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-green-100"
                    onClick={() => handleFilterChange("Responded")}
                  >
                    Responded
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-green-100"
                    onClick={() => handleFilterChange("Resolved")}
                  >
                    Resolved
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-100"
                    onClick={() => handleFilterChange("Rejected")}
                  >
                    Rejected
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-yellow-100"
                    onClick={() => handleFilterChange("Pending")}
                  >
                    Pending
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`overflow-auto max-h-96 rounded-lg w-full`}>
          <table className={`w-full text-left ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}>
            <thead className="hidden md:table-header-group">
              <tr className={`${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                <th className="p-3">Id</th>
                {app_type === "feedback" ? (
                  <>
                    <th className="p-3">Name</th>
                    <th className="p-3">Feedback Type</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Type</th>
                  </>
                ) : (
                  <>
                    <th className="p-3">Title</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3">Status</th>
                    {userRole === "faculty" && (
                      <th className="p-3">Action</th>
                    )}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <tr
                      key={request.id}
                      className={`${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } block md:table-row mb-4 md:mb-0`}
                    >
                      <td className="p-3 text-blue-500 cursor-pointer block md:table-cell">
                        <span className="font-semibold md:hidden">ID: </span>
                        {request.id}
                      </td>
                      
                      {app_type === "feedback" ? (
                        <>
                          <td className="p-3 block md:table-cell">
                            <span className="font-semibold md:hidden">Name: </span>
                            {request.name}
                          </td>
                          <td className="p-3 block md:table-cell">
                            <span className="font-semibold md:hidden">Feedback Type: </span>
                            {request.feedback_type}
                          </td>
                          <td className="p-3 block md:table-cell">
                            <span className="font-semibold md:hidden">Message: </span>
                            {request.message}
                          </td>
                          <td className="p-3 block md:table-cell">
                            <span className="font-semibold md:hidden">Type: </span>
                            {request.type}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-blue-500 cursor-pointer block md:table-cell">
                            <span className="font-semibold md:hidden">Title: </span>
                            <span
                              className="text-blue-500 cursor-pointer"
                              onClick={() => handleTitleClick(request)}
                            >
                              {request.title}
                            </span>
                          </td>
                          <td className="p-3 block md:table-cell">
                            <span className="font-semibold md:hidden">Date: </span>
                            {new Date(request.date).toLocaleDateString()}
                          </td>
                          <td className="p-3 block md:table-cell">
                            <span className="font-semibold md:hidden">Batch: </span>
                            {request.session}
                          </td>
                          <td className="p-3 block md:table-cell">
                            <span className="font-semibold md:hidden">Status: </span>
                            <span
                              className={
                                request.status === "Responded"
                                  ? "text-green-500 font-semibold"
                                  : request.status === "Rejected"
                                  ? "text-red-500 font-semibold"
                                  : "text-yellow-500 font-semibold"
                              }
                            >
                              {request.status}
                            </span>
                          </td>
                          {userRole === "faculty" && (
                            <td className="p-3 block md:table-cell">
                              <span className="font-semibold md:hidden">Action: </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  className={`p-2 hover:${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                  onClick={() => toggleEditPopup(request.id)}
                                >
                                  <FaEdit
                                    size={18}
                                    className={`${
                                      darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  />
                                </button>
                                <button
                                  className={`p-2 hover:${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                                  onClick={() => handleDelete(request.id)}
                                >
                                  <FaTrash
                                    size={18}
                                    className={`${
                                      darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  />
                                </button>
                              </div>
                            </td>
                          )}
                        </>
                      )}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td 
                    colSpan={app_type === "feedback" ? 5 : (userRole === "faculty" ? 6 : 5)} 
                    className="p-4 text-center"
                  >
                    No {app_type === "feedback" ? "feedback" : "complaints"} found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editPopupOpen && (
          <div
            className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50`}
            onClick={() => setEditPopupOpen(null)}
          >
            <div
              className={`p-6 rounded-lg shadow-2xl ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Update Status</h3>
              <div className="relative">
                <select
                  className={`w-full px-4 py-2 rounded-lg shadow-md ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Responded">Responded</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <button
                className={`mt-4 px-4 py-2 rounded-lg shadow-md ${
                  darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                }`}
                onClick={() => handleStatusChange(editPopupOpen)}
              >
                Update
              </button>
            </div>
          </div>
        )}

        {filteredRequests.length > 0 && (
          <TablePagination
            component="div"
            count={filteredRequests.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[3, 5, 10]}
            className={`flex-wrap ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
            sx={{
              "& .MuiTablePagination-toolbar": {
                backgroundColor: darkMode ? "#1F2937" : "#fff",
                color: darkMode ? "#fff" : "#000",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: darkMode ? "#fff" : "#000",
                },
              "& .MuiSelect-icon": {
                color: darkMode ? "#fff" : "#000",
              },
              "& .MuiIconButton-root": {
                color: darkMode ? "#fff" : "#000",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ComplaintTable;