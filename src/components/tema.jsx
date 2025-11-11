// ThemeProvider.js
import { useState, useEffect } from "react";
import { ThemeContext } from "../context";

export const TemaProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Ambil preferensi dari localStorage saat pertama kali render
        return localStorage.getItem("theme") || "light";
    });

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); // Simpan ke localStorage
    };

    useEffect(() => {
        document.body.setAttribute("data-theme", theme); // opsional: untuk styling global
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
