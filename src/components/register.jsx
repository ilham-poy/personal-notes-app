import { useState } from "react";
import "../styles/auth.css";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
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
            const res = await fetch("https://notes-api.dicoding.dev/v1/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await res.json();
            console.log(result)
            if (result.status === "success") {
                setMessage(result.message);
                localStorage.setItem('notes-token', result.data.accessToken);
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
            <h2 className="register-title">Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="register-input"
                />
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
                Sudah Punya Account ? Login <Link to='/auth/login'>  here </Link>
            </p>
            {message && <p className="register-message">{message}</p>}
        </div>
    );
}
