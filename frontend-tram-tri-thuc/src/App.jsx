import { ToastContainer } from "react-toastify";
import RouterCustom from "./custom/Router/RouterCustom";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <RouterCustom />;
            <ToastContainer />
        </>
    );
}

export default App;
