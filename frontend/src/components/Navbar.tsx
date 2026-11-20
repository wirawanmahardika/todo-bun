import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { myAxios } from "../helper/axiosInstance";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
    const navigate = useNavigate();

    const logoutAction = async () => {
        try {
            const res = await myAxios.delete("/api/v1/user/logout");
            if (res.status < 300) {
                toast.info("Berhasil logout");
                navigate("/login");
            }
        } catch {
            toast.error("Gagal logout");
        }
    };

    return (
        <header className="navbar bg-base-100/85 backdrop-blur-md border-b border-base-300 sticky top-0 z-40 px-4 sm:px-8 shadow-sm">
            <div className="navbar-start gap-2">
                <Link
                    to="/"
                    className="btn btn-ghost text-lg sm:text-xl font-extrabold tracking-tight px-2"
                >
                    <span className="text-primary">Bun</span>
                    <span>Todo</span>
                    <span className="badge badge-primary badge-soft badge-xs sm:badge-sm font-semibold">
                        v2
                    </span>
                </Link>
            </div>

            <div className="navbar-center hidden sm:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    <li>
                        <Link to="/" className="active font-medium">
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="navbar-end gap-2">
                <ThemeSwitcher />
                <button
                    type="button"
                    onClick={logoutAction}
                    className="btn btn-error btn-soft btn-sm gap-1.5"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.75}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                        />
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}
