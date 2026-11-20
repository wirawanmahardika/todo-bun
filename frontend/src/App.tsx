import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home, { homeLoader } from "./pages/home";
import Login, { loginAction } from "./pages/login";
import Signup, { signupAction } from "./pages/signup";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<Home />} loader={homeLoader} />
                <Route path="/login" element={<Login />} action={loginAction} />
                <Route
                    path="/signup"
                    element={<Signup />}
                    action={signupAction}
                />
            </>
        )
    );

    return <RouterProvider router={router} />;
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
