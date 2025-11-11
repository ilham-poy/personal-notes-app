import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthMiddleware() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("notes-token");
        if (!user) {
            navigate("/auth/login");
        }
    }, [navigate]);
}
