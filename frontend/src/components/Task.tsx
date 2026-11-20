import { useState, type Dispatch } from "react";
import { toast } from "react-toastify";
import { actionType } from "../reducer/todo-reducer";
import { myAxios } from "../helper/axiosInstance";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";

type taskProp = {
    taskId: number;
    content: string;
    finished: boolean;
    dispatch?: Dispatch<actionType>;
};

export default function Task({
    taskId,
    content,
    finished,
    dispatch,
}: taskProp) {
    const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
    const [updateModalVisibility, setUpdateModalVisibility] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const deleteModalVisibilityHandle = () => {
        setDeleteModalVisibility((prev) => !prev);
    };

    const updateModalVisibilityHandle = () => {
        setUpdateModalVisibility((prev) => !prev);
    };

    const handleChange = async () => {
        if (!dispatch || isToggling) return;
        setIsToggling(true);
        try {
            const res = await myAxios.patch("/api/v1/todo/" + taskId, {
                finished: !finished,
            });

            if (res.status < 300) {
                dispatch({
                    type: "setFinish",
                    payload: {
                        id: taskId,
                        activity: content,
                        id_user: 0,
                        finished: !finished,
                    },
                });
            }
        } catch {
            toast.error("Gagal memperbarui status tugas");
        } finally {
            setIsToggling(false);
        }
    };

    const deleteTodo = async () => {
        if (!dispatch) return;
        try {
            const res = await myAxios.delete("/api/v1/todo/" + taskId);
            if (res.status < 300) {
                dispatch({
                    type: "delete",
                    payload: {
                        id: taskId,
                        activity: content,
                        finished,
                        id_user: 0,
                    },
                });
                toast.success(res.data || "Tugas berhasil dihapus");
            }
        } catch {
            toast.error("Gagal menghapus tugas");
        }
    };

    const updateTodo = (text: string, setModalVisibility: () => void) => {
        return async () => {
            try {
                const res = await myAxios.patch("/api/v1/todo/" + taskId, {
                    activity: text,
                });

                if (res.status < 300 && dispatch) {
                    dispatch({
                        type: "update",
                        payload: {
                            id: taskId,
                            activity: text,
                            finished,
                            id_user: 0,
                        },
                    });
                    setModalVisibility();
                    toast.success(res.data || "Tugas berhasil diperbarui");
                }
            } catch {
                toast.error("Gagal mengubah tugas");
            }
        };
    };

    return (
        <>
            <div className="group flex items-center gap-3 p-4 hover:bg-base-200/60 transition-colors">
                <input
                    id={`task-${taskId}`}
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-md shrink-0"
                    checked={finished}
                    disabled={isToggling}
                    onChange={handleChange}
                />

                <label
                    htmlFor={`task-${taskId}`}
                    className={`flex-1 cursor-pointer text-base sm:text-lg transition-all break-words ${
                        finished
                            ? "line-through text-base-content/45"
                            : "text-base-content font-medium"
                    }`}
                >
                    {content}
                </label>

                <span
                    className={`badge badge-sm badge-soft hidden sm:inline-flex ${
                        finished ? "badge-success" : "badge-warning"
                    }`}
                >
                    {finished ? "Selesai" : "Aktif"}
                </span>

                <div className="flex items-center gap-1">
                    <div className="tooltip tooltip-top" data-tip="Edit">
                        <button
                            type="button"
                            onClick={updateModalVisibilityHandle}
                            className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/15"
                            aria-label="Edit task"
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
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="tooltip tooltip-top" data-tip="Hapus">
                        <button
                            type="button"
                            onClick={deleteModalVisibilityHandle}
                            className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/15"
                            aria-label="Delete task"
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
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <DeleteModal
                setVisibility={deleteModalVisibilityHandle}
                visible={deleteModalVisibility}
                deleteAction={deleteTodo}
            />

            <UpdateModal
                setVisibility={updateModalVisibilityHandle}
                visible={updateModalVisibility}
                updateAction={updateTodo}
                defaultActivity={content}
            />
        </>
    );
}
