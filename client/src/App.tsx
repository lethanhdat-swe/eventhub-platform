import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import VerifyEmail from "./pages/Verifyemail/Verifyemail";
import ForgotPassword from "./pages/Forgotpassword/Forgotpassword";
import ResetPassword from "./pages/Resetpassword/Resetpassword";
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* URL từ email: /verify-email?token=xxx */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* URL từ email: /reset-password?token=xxx */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
