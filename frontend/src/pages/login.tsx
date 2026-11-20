import {
    ActionFunctionArgs,
    Form,
    Link,
    useActionData,
    useNavigate,
    useNavigation,
} from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { myAxios } from "../helper/axiosInstance";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function Login() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const loginData = useActionData() as {
        data: string;
        status: number;
    } | null;

    useEffect(() => {
        myAxios.get("/api/v1/user/info").then(() => {
            navigate("/");
        });
    }, [navigate]);

    useEffect(() => {
        if (!loginData) return;
        if (loginData.status < 300) {
            toast.success(loginData.data || "Berhasil login");
            navigate("/");
        } else {
            toast.error(loginData.data || "Username atau password salah");
        }
    }, [loginData, navigate]);

    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeSwitcher />
            </div>

            <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-base-300">
                <div className="card-body p-6 sm:p-8 space-y-4">
                    <div className="text-center space-y-1">
                        <div className="inline-flex items-center gap-2 mb-1">
                            <span className="text-2xl font-extrabold tracking-tight">
                                <span className="text-primary">Bun</span>Todo
                            </span>
                            <span className="badge badge-primary badge-soft badge-sm">
                                Auth
                            </span>
                        </div>
                        <h1 className="text-xl font-bold">
                            Masuk ke Akun Anda
                        </h1>
                        <p className="text-sm text-base-content/60">
                            Lanjutkan mengelola daftar tugas Anda
                        </p>
                    </div>

                    {loginData && loginData.status >= 300 && (
                        <div role="alert" className="alert alert-error alert-soft text-sm py-2.5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{loginData.data}</span>
                        </div>
                    )}

                    <Form method="post" className="space-y-4">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Username</legend>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="input input-bordered input-primary w-full"
                                placeholder="Masukkan username anda"
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Password</legend>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="input input-bordered input-primary w-full"
                                required
                            />
                        </fieldset>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full mt-2"
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner loading-sm" />
                            )}
                            <span>{isSubmitting ? "Memproses..." : "Login"}</span>
                        </button>
                    </Form>

                    <div className="divider text-xs text-base-content/50 my-1">
                        ATAU
                    </div>

                    <p className="text-center text-sm text-base-content/70">
                        Belum punya akun?{" "}
                        <Link
                            to="/signup"
                            className="link link-primary font-semibold"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const loginAction = async ({ request }: ActionFunctionArgs) => {
    const data = Object.fromEntries(await request.formData());
    try {
        const res = await myAxios.post("/api/v1/user/login", data);

        return { data: res.data, status: res.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const res = error.response;
            return { data: res.data, status: res.status };
        }
        return null;
    }
};
