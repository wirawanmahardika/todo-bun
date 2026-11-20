import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import Task from "../components/Task";
import { arrayOfTodo, todoReducer } from "../reducer/todo-reducer";
import type { todo } from "../types/todo-type";
import { myAxios } from "../helper/axiosInstance";
import Navbar from "../components/Navbar";

type FilterType = "all" | "active" | "completed";

export default function Home() {
    const navigate = useNavigate();
    const loadedTodos = useLoaderData() as arrayOfTodo;
    const [todos, dispatch] = useReducer(todoReducer, loadedTodos);
    const [filter, setFilter] = useState<FilterType>("all");
    const [search, setSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        myAxios.get("/api/v1/user/info").catch(() => {
            navigate("/login");
        });
    }, [navigate]);

    const addTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const activityInput = form.elements.namedItem(
            "activity"
        ) as HTMLInputElement;
        const value = activityInput.value.trim();
        if (!value || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await myAxios.post("/api/v1/todo", {
                activity: value,
            });

            if (res.status < 300) {
                dispatch({ type: "add", payload: res.data.data });
                toast.success(res.data.message || "Tugas berhasil ditambahkan");
                activityInput.value = "";
            }
        } catch {
            toast.error("Gagal menambahkan tugas");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalCount = todos.length;
    const completedCount = todos.filter((t) => t.finished).length;
    const activeCount = totalCount - completedCount;
    const completionRate =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const filteredTodos = todos.filter((t: todo) => {
        const matchesFilter =
            filter === "all"
                ? true
                : filter === "active"
                ? !t.finished
                : t.finished;
        const matchesSearch = t.activity
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar />

            <main className="container max-w-4xl mx-auto px-4 py-8 flex-1 space-y-6">
                {/* Header & Stats */}
                <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Task Workspace
                            </h1>
                            <p className="text-base-content/65 text-sm sm:text-base mt-1">
                                Kelola daftar tugas harianmu dengan cepat dan
                                terstruktur.
                            </p>
                        </div>
                        <div className="badge badge-primary badge-outline gap-1.5 py-3 px-3">
                            <span className="size-2 rounded-full bg-primary animate-pulse" />
                            <span>{completionRate}% Selesai</span>
                        </div>
                    </div>

                    <div className="stats stats-vertical sm:stats-horizontal shadow-md bg-base-100 border border-base-300 w-full">
                        <div className="stat">
                            <div className="stat-title">Total Tugas</div>
                            <div className="stat-value text-primary">
                                {totalCount}
                            </div>
                            <div className="stat-desc">Semua aktivitas</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Sedang Aktif</div>
                            <div className="stat-value text-warning">
                                {activeCount}
                            </div>
                            <div className="stat-desc">Perlu dikerjakan</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Selesai</div>
                            <div className="stat-value text-success">
                                {completedCount}
                            </div>
                            <div className="stat-desc">
                                <progress
                                    className="progress progress-success w-28"
                                    value={completionRate}
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Add Todo Card */}
                <section className="card bg-base-100 shadow-lg border border-base-300">
                    <div className="card-body p-4 sm:p-6">
                        <form onSubmit={addTodo} className="join w-full">
                            <input
                                type="text"
                                name="activity"
                                placeholder="Tulis tugas baru anda disini..."
                                className="input input-bordered input-primary join-item w-full"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary join-item px-6"
                            >
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="size-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                )}
                                <span className="hidden sm:inline">Tambah</span>
                            </button>
                        </form>
                    </div>
                </section>

                {/* Filter & List Card */}
                <section className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
                    <div className="p-4 border-b border-base-300 flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-base-100">
                        <div role="tablist" className="tabs tabs-box bg-base-200">
                            <button
                                type="button"
                                role="tab"
                                onClick={() => setFilter("all")}
                                className={`tab gap-1.5 ${
                                    filter === "all" ? "tab-active" : ""
                                }`}
                            >
                                <span>Semua</span>
                                <span className="badge badge-xs">
                                    {totalCount}
                                </span>
                            </button>
                            <button
                                type="button"
                                role="tab"
                                onClick={() => setFilter("active")}
                                className={`tab gap-1.5 ${
                                    filter === "active" ? "tab-active" : ""
                                }`}
                            >
                                <span>Aktif</span>
                                <span className="badge badge-xs badge-warning">
                                    {activeCount}
                                </span>
                            </button>
                            <button
                                type="button"
                                role="tab"
                                onClick={() => setFilter("completed")}
                                className={`tab gap-1.5 ${
                                    filter === "completed" ? "tab-active" : ""
                                }`}
                            >
                                <span>Selesai</span>
                                <span className="badge badge-xs badge-success">
                                    {completedCount}
                                </span>
                            </button>
                        </div>

                        <label className="input input-bordered input-sm flex items-center gap-2 w-full sm:w-64">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="size-4 opacity-60"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <input
                                type="text"
                                className="grow"
                                placeholder="Cari tugas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                    </div>

                    {filteredTodos.length === 0 ? (
                        <div className="p-12 text-center space-y-2">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-base-200 text-base-content/50">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-7"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg">
                                Tidak ada tugas
                            </h3>
                            <p className="text-sm text-base-content/60">
                                {search
                                    ? "Tidak ditemukan tugas yang cocok dengan pencarianmu."
                                    : "Tambahkan tugas pertamamu di atas untuk mulai."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-base-300">
                            {filteredTodos.map((t: todo) => (
                                <Task
                                    key={t.id}
                                    taskId={t.id}
                                    content={t.activity}
                                    finished={t.finished}
                                    dispatch={dispatch}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const homeLoader = async () => {
    try {
        const res = await myAxios.get("/api/v1/todo");
        return res.data;
    } catch {
        return [];
    }
};
