import { Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";

function App() {
    return (
        <>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            </Routes>
        </>
    );
}

export default App;
