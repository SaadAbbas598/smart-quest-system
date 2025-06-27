import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/auth/signup";
import LoginPage from "./pages/auth/LoginPage";

import Dashboard from "./pages/admin/Dashboard";
import Complaint from "./pages/admin/Complaint";
import Request from "./pages/admin/Request";
import Scomplaint from "./pages/student/Scomplaint";
import Sdashboard from "./pages/student/Sdashboard";
import FeedbackForm from "./pages/student/Feedback";
import Srequest from "./pages/student/Srequest";
import FRequest from "./pages/faculty/Frequest";
import FDashboard from "./pages/faculty/Fdashboard";
import Feedback from "./pages/admin/Feedback";
import Adminlogin from "./pages/auth/Adminlogin";
import Application from "./pages/student/Application";
import Profile from "./pages/student/account/Profile";
import ChangePssswords from "./pages/student/account/ChangePasswords";
import FacultyChangePssswords from "./pages/faculty/account/ChangePasswords";
import AdminChangePssswords from "./pages/admin/account/ChangePasswords";
import FComplaint from "./pages/faculty/Fcomplaint";
import PrivateRoute from "./components/PrivateRoute";
import FacultyProfile from "./pages/faculty/account/Profile";
import AdminProfile from "./pages/admin/account/Profile";
import PageNotFound from "./components/PageNotFound";
import EmailVerifyActivateAccount from "./components/VerifyEmail";
import SSchedule from "./pages/student/Schedule";
import Semester from "./pages/student/Semester";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Redirecting "/" to "/signup" */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<Adminlogin />} />

          {/* Redirecting  Verifying your Account*/}
          <Route path="/verify-account" element={<EmailVerifyActivateAccount />} />

          {/* Protect Admin Routes */}
          <Route path="admin-dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="admin-complaint" element={<PrivateRoute element={<Complaint />} />} />
          <Route path="admin-request" element={<PrivateRoute element={<Request />} />} />
          <Route path="admin-feedback" element={<PrivateRoute element={<Feedback />} />} />
          <Route path="admin-schedule" element={<PrivateRoute element={<SSchedule />} />} />
          <Route path="admin-semester" element={<PrivateRoute element={<Semester />} />} />



          {/* Protect Student Routes */}
          <Route path="student-complaint" element={<PrivateRoute element={<Scomplaint />} />} />
          <Route path="student-dashboard" element={<PrivateRoute element={<Sdashboard />} />} />
          <Route path="student-request" element={<PrivateRoute element={<Srequest />} />} />
          <Route path="student-feedback" element={<PrivateRoute element={<FeedbackForm />} />} />
          <Route path="student-schedule" element={<PrivateRoute element={<SSchedule />} />} />
          <Route path="student-semester" element={<PrivateRoute element={<Semester />} />} />




          {/* Protect Faculty Routes */}
          <Route path="faculty-complaint" element={<PrivateRoute element={<FComplaint />} />} />
          <Route path="faculty-request" element={<PrivateRoute element={<FRequest />} />} />
          <Route path="faculty-dashboard" element={<PrivateRoute element={<FDashboard />} />} />
          <Route path="faculty-schedule" element={<PrivateRoute element={<SSchedule />} />} />
          <Route path="faculty-semester" element={<PrivateRoute element={<Semester />} />} />




          {/* Protect Application Form */}
          <Route path="application-form/:id" element={<PrivateRoute element={<Application />} />} />

          {/* Protect Profile & Password Change Routes */}
          <Route path="student/view-profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="student/change-password" element={<PrivateRoute element={<ChangePssswords />} />} />
          <Route path="faculty/view-profile" element={<PrivateRoute element={<FacultyProfile/>} />} />
          <Route path="faculty/change-password" element={<PrivateRoute element={<FacultyChangePssswords />} />} />
          <Route path="admin/view-profile" element={<PrivateRoute element={<AdminProfile />} />} />
          <Route path="admin/change-password" element={<PrivateRoute element={<AdminChangePssswords />} />} />

  
           



          {/* Fallback Route for 404 Page Not Found */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
