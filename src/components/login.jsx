import { useState } from "react";
import "../styles/auth.css";
import { Link } from "react-router-dom";
export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            setIsLoading(true)

            const res = await fetch("https://notes-api.dicoding.dev/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await res.json();
            console.log(result)

            if (result.status === "success") {
                setMessage(result.message);
                localStorage.setItem('notes-token', result.data.accessToken);
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
                setForm({ name: "", email: "", password: "" });

            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-container">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-popup">
                        Loading...
                    </div>
                </div>
            )}
            <h2 className="register-title">Login</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="register-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 chars)"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="register-input"
                />
                <button type="submit" className="register-button">Create Account</button>
            </form>
            <p>
                Belum Punya Account ? Register <Link to='/auth/register'> here</Link>
            </p>

            {message && <p className="register-message">{message}</p>}
        </div>
    );
}