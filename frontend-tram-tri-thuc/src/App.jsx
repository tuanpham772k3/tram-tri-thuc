import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./Routes";
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteDocuments } from "./store/slices/userSlice";
import { useEffect } from "react";

function App() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchFavoriteDocuments({ page: 1, limit: 100 }));
        }
    }, [userInfo, dispatch]);
    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer
                position="bottom-right"
                autoClose={3000} // Đóng sau 3s
                limit={1} // Giới hạn 1 toast cùng lúc
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />
        </>
    );
}

export default App;
