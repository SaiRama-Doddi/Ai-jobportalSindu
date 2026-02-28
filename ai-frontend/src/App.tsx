import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import ViewAllJobs from "./components/ViewAllJobs";
import JobCandidates from "./pages/hr/JobCandidates";
import HrDashboard from "./pages/hr/HrDashboard";
import CreateJob from "./pages/hr/CreateJob";
import EditJob from "./pages/hr/EditJob";
import InterviewerHome from "./pages/InterviewerHome";
import InterviewEvaluation from "./pages/InterviewEvaluation";
import HrInterviewers from "./pages/HrInterviewers";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20 px-4">
        <Routes>
          {/* Hero Page */}
          <Route path="/" element={<Home />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/alljobs" element={<ViewAllJobs />} />

          {/* 404 */}
          <Route
            path="*"
            element={<h1 className="text-center text-2xl">Page Not Found</h1>}
          />
         <Route path="/hr" element={<HrDashboard />} />
<Route path="/hr/create" element={<CreateJob />} />
<Route path="/hr/job/:jobId" element={<JobCandidates />} />
<Route path="/hr/edit/:jobId" element={<EditJob />} />

<Route path="/interviewer" element={<InterviewerHome />} />
<Route path="/interview/:interviewId" element={<InterviewEvaluation />} />

<Route path="/hr/interviewers" element={<HrInterviewers />} />

<Route path="/admin/login" element={<AdminLogin />} />
<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
        </Routes>
        
      </main>

      <Footer />
    </div>
  );
}

export default App;
