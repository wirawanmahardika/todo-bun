import { useEffect, useState } from "react";

const THEMES = [
    { id: "night", label: "Night" },
    { id: "synthwave", label: "Synthwave" },
    { id: "dracula", label: "Dracula" },
    { id: "cyberpunk", label: "Cyberpunk" },
    { id: "winter", label: "Winter" },
    { id: "nord", label: "Nord" },
] as const;

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<string>(() => {
        return localStorage.getItem("theme") || "night";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm gap-1.5"
                aria-label="Change theme"
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
                        d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
                    />
                </svg>
                <span className="hidden sm:inline capitalize">{theme}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4 opacity-60"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-200 rounded-box z-50 w-44 p-2 shadow-xl border border-base-300 mt-2"
            >
                {THEMES.map((t) => (
                    <li key={t.id}>
                        <button
                            type="button"
                            onClick={() => setTheme(t.id)}
                            className={`flex items-center justify-between ${
                                theme === t.id ? "active font-semibold" : ""
                            }`}
                        >
                            <span>{t.label}</span>
                            <span
                                data-theme={t.id}
                                className="flex gap-0.5 bg-base-100 p-1 rounded"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                <span className="w-2 h-2 rounded-full bg-secondary" />
                                <span className="w-2 h-2 rounded-full bg-accent" />
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
