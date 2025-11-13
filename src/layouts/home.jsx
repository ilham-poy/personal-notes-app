import { useState, useEffect } from 'react';
import { getInitialData, showFormattedDate } from '../utils';
import { Link } from 'react-router-dom';
import ComponentArchive from '../components/archive';
import '../App.css';
import NotesControl from '../components/create';
import DeleteNote from '../components/delete';
import SearchComponent from '../components/search';
import useAuthMiddleware from '../auth/auth';
import { useContext } from "react";
import { ThemeContext } from '../context';

export default function HomePage() {
    useAuthMiddleware();

    const [notes, setNotes] = useState([]);
    const [archiveNotes, setArchiveNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [archiveFilter, setArchiveFilter] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));





    console.log(user)
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
    useEffect(() => {
        const fetchNotes = async () => {

            try {
                const token = localStorage.getItem("notes-token");
                const url = archiveFilter
                    ? "https://notes-api.dicoding.dev/v1/notes/archived"
                    : "https://notes-api.dicoding.dev/v1/notes";

                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                setIsLoading(true)
                const result = await res.json();

                if (result.status === "success") {

                    const savedNotes = result.data;
                    if (archiveFilter) {
                        setArchiveNotes(savedNotes);
                    } else {
                        setNotes(savedNotes);
                    }

                    localStorage.setItem('notes', JSON.stringify(savedNotes));
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)

                } else {
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)

                    setMessage("Failed to fetch notes.");
                }
            } catch (error) {
                setMessage("Please try again.");
            }
        };

        fetchNotes();
    }, [archiveFilter]);



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
    const handleDelete = async (id) => {

        try {
            const token = localStorage.getItem("notes-token");
            const res = await fetch(`https://notes-api.dicoding.dev/v1/notes/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setIsLoading(true)

            const result = await res.json();
            console.log(result)
            if (result.status === "success") {
                const updatedNotes = notes.filter((note) => note.id !== id);
                setNotes(updatedNotes);
                localStorage.setItem('notes', JSON.stringify(updatedNotes));
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            } else {
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
                setMessage(result.message);

            }
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
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


    function handleNoteArchive(id, isArchived) {
        const toggleArchive = async () => {
            try {
                setIsLoading(true)
                const token = localStorage.getItem("notes-token");

                const url = isArchived
                    ? `https://notes-api.dicoding.dev/v1/notes/${id}/unarchive`
                    : `https://notes-api.dicoding.dev/v1/notes/${id}/archive`;

                const res = await fetch(url, {
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
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
                } else {
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)

                    setMessage("Failed to update archive status.");
                }
            } catch (error) {
                setMessage("Please try again.");
            }
        };

        toggleArchive();
    }




    return (
        <div className="container">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-popup">
                        Loading...
                    </div>
                    disable click
                </div>
            )}
            <h1>Selamat Datang "{user?.name}"</h1>
            <br />

            <button onClick={toggleTheme}>
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
            <br />
            <br />
            <NotesControl onCreate={handleCreate} />
            <ComponentArchive onStatus={handleArchive} />
            <SearchComponent onSearch={handleSearch} />
            <div className="notes-wrapper">
                {notes.length > 0 ? (
                    notes
                        .filter(note => note.archived === archiveFilter)
                        .map((data) => (
                            <div className="card" key={data.id}>
                                <div className="card-tag archived-tag">
                                    {data.archived ? "📦 Archived" : "📌 Digunakan"}
                                </div>
                                <div className="card-title">{data.title}</div>
                                <div className="card-body">{data.body}</div>
                                <div className="card-footer">
                                    <DeleteNote onDelete={() => handleDelete(data.id)} />
                                    <p>-</p>
                                    <button onClick={() => handleNoteArchive(data.id, data.archived)}>
                                        {data.archived ? "Buka Arsip" : "Arsipkan"}
                                    </button>
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
                    <div className="empty-note-message">Tidak ada catatan</div>
                )}
            </div>
        </div>

    );
}