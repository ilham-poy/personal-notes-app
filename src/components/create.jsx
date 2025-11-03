import React, { useState } from 'react';

function NotesControl({ onCreate }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [archived, setArchived] = useState(false);
    function handleSubmit(e) {
        e.preventDefault();
        if (title.trim() && body.trim()) {
            onCreate({ title, body, archived });
            setTitle('');
            setBody('');
            setArchived(false);
        }
    }

    return (
        <div className="settings">
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">
                    Judul
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        maxLength={70}
                    />
                    <p className="char-count">Maks : {title.length}/70 karakter</p>
                </label>
                <label htmlFor="body">
                    Catatan
                    <input
                        type="text"
                        id="body"
                        value={body}
                        onChange={e => setBody(e.target.value)}
                    />
                </label>
                <label htmlFor="archived">
                    Status Arsip
                    <select
                        id="archived"
                        value={archived ? "true" : "false"} // tampil di UI tetap string
                        onChange={e => setArchived(e.target.value === "true")} // ubah ke boolean
                    >
                        <option value="true">Archived</option>
                        <option value="false">Not Archived</option>
                    </select>
                </label>
                <button type="submit">
                    Tambahkan Catatan
                </button>
            </form>
        </div>
    );
}

export default NotesControl;
