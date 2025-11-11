import { useState, useEffect } from 'react';
import { getInitialData, showFormattedDate } from '../utils';
import { Link } from 'react-router-dom';
import ComponentArchive from '../components/archive';
import '../App.css';
import NotesControl from '../components/create';
import DeleteNote from '../components/delete';
import SearchComponent from '../components/search';
import useAuthMiddleware from '../auth/auth';

export default function HomePage() {
    useAuthMiddleware();

    const [notes, setNotes] = useState([]);
    const [archiveNotes, setArchiveNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);

    const [archiveFilter, setArchiveFilter] = useState(null);
    const [message, setMessage] = useState("");




    // useEffect(() => {
    //     const savedNotes = JSON.parse(localStorage.getItem('notes'));

    //     if (savedNotes && savedNotes.length > 0) {
    //         setNotes(savedNotes);
    //     } else {
    //         const initialData = getInitialData();
    //         setNotes(initialData);
    //         localStorage.setItem('notes', JSON.stringify(initialData));
    //     }
    // }, []);
    if (archiveFilter === true) {
        useEffect(() => {
            const fetchNotes = async () => {
                try {
                    const token = localStorage.getItem("notes-token");

                    const res = await fetch("https://notes-api.dicoding.dev/v1/notes/archived", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                    });

                    const result = await res.json();
                    if (result.status === "success") {
                        const savedNotes = JSON.parse(localStorage.getItem('notes'));
                        if (savedNotes && savedNotes.length > 0) {
                            savedNotes.filter(note => note.archived === true)
                            setArchiveNotes(savedNotes);
                        } else {
                            // const initialData = getInitialData();
                            setArchiveNotes([]);
                            localStorage.setItem('notes', JSON.stringify([]));
                        }
                    } else {
                        setMessage("Failed to fetch notes.");
                    }
                } catch (error) {
                    setMessage("Please try again.");
                }
            };

            if (archiveFilter !== null) {
                fetchNotes();
            }
        }, [archiveFilter]);
    } else {
        useEffect(() => {
            const fetchNotes = async () => {
                try {
                    const token = localStorage.getItem("notes-token");

                    const res = await fetch("https://notes-api.dicoding.dev/v1/notes", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                    });

                    const result = await res.json();

                    if (result.status === "success") {
                        const savedNotes = JSON.parse(localStorage.getItem('notes'));
                        if (savedNotes && savedNotes.length > 0) {
                            setNotes(savedNotes);
                        } else {
                            // const initialData = getInitialData();
                            setNotes([]);
                            localStorage.setItem('notes', JSON.stringify([]));
                        }
                    } else {
                        setMessage("Failed to fetch notes.");
                    }
                } catch (error) {
                    setMessage("Please try again.");
                }
            };

            fetchNotes();
        }, [notes]);
    }








    function handleCreate(newNote) {
        const noteWithDate = {
            ...newNote,
            id: +new Date(),
            createdAt: new Date().toISOString(),
            // archived: newNote.archived || false,
        };
        const updatedNotes = [...notes, noteWithDate];

        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }

    function handleDelete(id) {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }

    function handleSearch(keyword) {
        if (!keyword.trim()) {
            setFilteredNotes([]);
            return;
        }
        const lowerKeyword = keyword.toLowerCase();
        const results = notes.filter((note) =>
            note.title.toLowerCase().includes(lowerKeyword)
        );
        setFilteredNotes(results);
    }

    function handleArchive(status) {
        setArchiveFilter(status);
    }


    function handleNoteArchive(id) {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("notes-token");

                const res = await fetch(`https://notes-api.dicoding.dev/v1/notes/${id}/archive`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const result = await res.json();

                if (result.status === "success") {
                    const allNotes = JSON.parse(localStorage.getItem('notes')) || [];

                    const updatedNotes = allNotes.map((note) => {
                        if (String(note.id) === String(id)) {
                            return {
                                ...note,
                                archived: !note.archived
                            };
                        }
                        return note;
                    });

                    localStorage.setItem('notes', JSON.stringify(updatedNotes));
                    setNotes(updatedNotes);
                } else {
                    setMessage("Failed to fetch notes.");
                }
            } catch (error) {
                setMessage("Please try again.");
            }
        };

        fetchNotes();
    }

    // filter  dulu berdasarkan length


    return (
        <div className="container">
            <NotesControl onCreate={handleCreate} />
            <ComponentArchive onStatus={handleArchive} />
            <SearchComponent onSearch={handleSearch} />

            <div className="notes-wrapper">
                {notes.length > 0 ? (
                    archiveFilter ? (
                        notes.filter(note => archived === true).map((data) => (
                            <div className="card" key={data.id}>
                                {data.archived ? (
                                    <div className="card-tag archived-tag">📦 Archived</div>
                                ) : (
                                    <div className="card-tag archived-tag">📌 Digunakan</div>
                                )}
                                <div className="card-title">{data.title}</div>
                                <div className="card-body">{data.body}</div>
                                <div className="card-footer">
                                    <DeleteNote onDelete={() => handleDelete(data.id)} />
                                    <p>
                                        -
                                    </p>
                                    {data.archived ? (
                                        <button onClick={() => handleNoteArchive(data.id)}>
                                            Buka Arsip
                                        </button>
                                    ) : (
                                        <button onClick={() => handleNoteArchive(data.id)}>
                                            Arsipkan
                                        </button>
                                    )}

                                    <div className="card-date">
                                        {showFormattedDate(data.createdAt)}
                                    </div>
                                </div>
                                <Link
                                    to={`/note/${data.id}`}
                                    state={{ note: data }}
                                    className="detail-link"
                                >
                                    Detail
                                </Link>
                            </div>
                        ))
                    ) : (
                        notes.filter(note => archived === false).map((data) => (
                            <div className="card" key={data.id}>
                                {data.archived ? (
                                    <div className="card-tag archived-tag">📦 Archived</div>
                                ) : (
                                    <div className="card-tag archived-tag">📌 Digunakan</div>
                                )}
                                <div className="card-title">{data.title}</div>
                                <div className="card-body">{data.body}</div>
                                <div className="card-footer">
                                    <DeleteNote onDelete={() => handleDelete(data.id)} />
                                    <p>
                                        -
                                    </p>
                                    {data.archived ? (
                                        <button onClick={() => handleNoteArchive(data.id)}>
                                            Buka Arsip
                                        </button>
                                    ) : (
                                        <button onClick={() => handleNoteArchive(data.id)}>
                                            Arsipkan
                                        </button>
                                    )}

                                    <div className="card-date">
                                        {showFormattedDate(data.createdAt)}
                                    </div>
                                </div>
                                <Link
                                    to={`/note/${data.id}`}
                                    state={{ note: data }}
                                    className="detail-link"
                                >
                                    Detail
                                </Link>
                            </div>
                        ))
                    )

                ) : (
                    <div className="empty-note-message">Tidak ada catatan</div>
                )}
            </div>
        </div>
    );
}
