import type { todo } from "../types/todo-type";

export type arrayOfTodo = Array<todo>;

export type actionType = {
    type: "add" | "delete" | "update" | "setFinish";
    payload?: todo;
};

export function todoReducer(
    state: arrayOfTodo,
    action: actionType
): arrayOfTodo {
    switch (action.type) {
        case "setFinish":
            if (!action.payload) return state;
            return state.map((t) =>
                t.id === action.payload?.id
                    ? { ...t, finished: action.payload.finished }
                    : t
            );

        case "add":
            if (action.payload) return [...state, action.payload];
            return state;

        case "delete":
            if (action.payload) {
                return state.filter((t) => t.id !== action.payload?.id);
            }
            return state;

        case "update":
            if (action.payload) {
                return state.map((t) =>
                    t.id === action.payload?.id
                        ? { ...t, activity: action.payload.activity }
                        : t
                );
            }
            return state;

        default:
            return state;
    }
}
