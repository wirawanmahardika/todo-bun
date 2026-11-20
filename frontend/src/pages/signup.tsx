import { useEffect } from "react";
import {
    ActionFunctionArgs,
    Form,
    Link,
    useActionData,
    useNavigate,
    useNavigation,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { myAxios } from "../helper/axiosInstance";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function Signup() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const actionData = useActionData() as {
        message: string;
        status: number;
    } | null;

    useEffect(() => {
        if (!actionData) return;
        if (actionData.status < 300) {
            toast.success(actionData.message || "Berhasil mendaftar!");
            navigate("/login");
        } else {
            toast.error(actionData.message || "Pendaftaran gagal");
        }
    }, [actionData, navigate]);

    useEffect(() => {
        myAxios.get("/api/v1/user/info").then(() => {
            navigate("/");
        });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeSwitcher />
            </div>

            <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-base-300 my-8">
                <div className="card-body p-6 sm:p-8 space-y-4">
                    <div className="text-center space-y-1">
                        <div className="inline-flex items-center gap-2 mb-1">
                            <span className="text-2xl font-extrabold tracking-tight">
                                <span className="text-primary">Bun</span>Todo
                            </span>
                            <span className="badge badge-secondary badge-soft badge-sm">
                                Register
                            </span>
                        </div>
                        <h1 className="text-xl font-bold">Buat Akun Baru</h1>
                        <p className="text-sm text-base-content/60">
                            Mulai atur produktivitas harian Anda
                        </p>
                    </div>

                    {actionData && actionData.status >= 300 && (
                        <div role="alert" className="alert alert-error alert-soft text-sm py-2.5">
                            <span>
                                {typeof actionData.message === "string"
                                    ? actionData.message
                                    : "Validasi gagal, periksa input Anda."}
                            </span>
                        </div>
                    )}

                    <Form method="post" className="space-y-3">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                Nama Lengkap
                            </legend>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                className="input input-bordered input-primary w-full"
                                placeholder="John Doe"
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email</legend>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="input input-bordered input-primary w-full"
                                placeholder="name@gmail.com"
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                Username
                            </legend>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="input input-bordered input-primary w-full"
                                placeholder="johndoe (min. 6 karakter)"
                                minLength={6}
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
                            <span>
                                {isSubmitting ? "Mendaftarkan..." : "Sign Up"}
                            </span>
                        </button>
                    </Form>

                    <div className="divider text-xs text-base-content/50 my-1">
                        ATAU
                    </div>

                    <p className="text-center text-sm text-base-content/70">
                        Sudah punya akun?{" "}
                        <Link
                            to="/login"
                            className="link link-primary font-semibold"
                        >
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const signupAction = async ({ request }: ActionFunctionArgs) => {
    const data = Object.fromEntries(await request.formData()) as {
        fullname: string;
        username: string;
        email: string;
        password: string;
    };

    try {
        const res = await myAxios.post("/api/v1/user/signup", data);
        return { message: res.data, status: 200 };
    } catch (error) {
        console.log(error);

        const message =
            axios.isAxiosError(error) && error.response
                ? typeof error.response.data === "string"
                    ? error.response.data
                    : error.response.data?.message || "Signup gagal"
                : "Signup gagal";
        return { message, status: 422 };
    }
};
