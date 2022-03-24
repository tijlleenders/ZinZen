import { atom, selector } from "recoil";

export const darkModeState = atom({
    key: "darkModeState",
    default: localStorage.getItem("theme") === "dark" ? true : false,
});

export const darkModeStateToggle = selector({
    key: "darkModeStateToggle",
    get: ({ get }) => {
        get(darkModeState);
    },
    set: ({ get, set }) => {
        const currentState = get(darkModeState);
        set(darkModeState, !currentState);
    },
});
