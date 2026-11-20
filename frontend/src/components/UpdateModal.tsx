import { useState, type FormEvent } from "react";

export default function UpdateModal({
    visible,
    setVisibility,
    updateAction,
    defaultActivity,
}: {
    visible: boolean;
    setVisibility: () => void;
    updateAction: (text: string, setModalVisibility: () => void) => () => void;
    defaultActivity: string;
}) {
    const [input, setInput] = useState(defaultActivity);

    const handleClose = () => {
        setInput(defaultActivity);
        setVisibility();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        updateAction(input.trim(), setVisibility)();
    };

    return (
        <dialog className={`modal ${visible ? "modal-open" : ""}`}>
            <div className="modal-box border border-base-300 shadow-2xl">
                <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                    aria-label="Close"
                >
                    ✕
                </button>
                <h3 className="font-bold text-lg">Update Tugas Kamu</h3>
                <p className="text-sm text-base-content/60 mt-1">
                    Ubah deskripsi tugas di bawah ini lalu simpan.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Nama tugas..."
                        className="input input-bordered input-primary w-full"
                        autoFocus={visible}
                        required
                    />
                    <div className="modal-action mt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-ghost"
                        >
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={handleClose}>
                    close
                </button>
            </form>
        </dialog>
    );
}
