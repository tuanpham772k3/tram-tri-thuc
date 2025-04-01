import { Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword/ResetPassword";

function App() {
    return (
        <>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
