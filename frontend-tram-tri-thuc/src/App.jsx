import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./custom/Routes";
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "./store/slices/authSlice";

function App() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>; // Hoặc component LoadingSpinner
    }
    return (
        <>
            <RouterProvider router={router} /> ;
            <ToastContainer />
        </>
    );
}

export default App;
