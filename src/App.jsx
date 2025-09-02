import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import DashboardPage from "@/components/pages/DashboardPage";
import PatientsPage from "@/components/pages/PatientsPage";
import AppointmentsPage from "@/components/pages/AppointmentsPage";
import BedsPage from "@/components/pages/BedsPage";
import DepartmentsPage from "@/components/pages/DepartmentsPage";
import EmergencyPage from "@/components/pages/EmergencyPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="beds" element={<BedsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;