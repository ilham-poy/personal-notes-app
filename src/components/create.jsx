import React, { useState } from 'react';

function NotesControl({ onCreate }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [archived, setArchived] = useState(false);
    const [form, setForm] = useState({ title: "", body: "" });
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("notes-token");

            const res = await fetch("https://notes-api.dicoding.dev/v1/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form),
            });

            const result = await res.json();
            console.log(result)

            if (result.status === "success") {
                setMessage(result.message);
                if (!localStorage.getItem("notes")) {
                    const data = []
                    data.push(result.data);
                    localStorage.setItem("notes", JSON.stringify(data));
                } else {
                    const oldNotes = JSON.parse(localStorage.getItem("notes"));
                    const newNotes = [...oldNotes, result.data];
                    localStorage.setItem("notes", JSON.stringify(newNotes));
                }

                setForm({ title: "", body: "" });
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
    };


    return (
        <div className="settings">
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">
                    Judul
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />
                    <p className="char-count">Maks : {title.length}/70 karakter</p>
                </label>
                <label htmlFor="body">
                    Catatan
                    <input
                        type="text"
                        id="body"
                        name="body"
                        value={form.body}
                        onChange={handleChange}
                    />
                </label>
                {/* <label htmlFor="archived">
                    Status Arsip
                    <select
                        id="archived"
                        name='archived'
                        value={form.archived}
                        onChange={handleChange}
                    >
                        <option value="true">Archived</option>
                        <option value="false">Not Archived</option>
                    </select>
                </label> */}
                <button type="submit">
                    Tambahkan Catatan
                </button>
            </form>
        </div>
    );
}

export default NotesControl;
