import { useState, useEffect } from 'react';
import { getInitialData, showFormattedDate } from '../utils';
import { Link } from 'react-router-dom';
import ComponentArchive from '../components/archive';
import '../App.css';
import NotesControl from '../components/create';
import DeleteNote from '../components/delete';
import SearchComponent from '../components/search';

export default function HomePage() {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [archiveFilter, setArchiveFilter] = useState(null);

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem('notes'));

        if (savedNotes && savedNotes.length > 0) {
            setNotes(savedNotes);
        } else {
            const initialData = getInitialData();
            setNotes(initialData);
            localStorage.setItem('notes', JSON.stringify(initialData));
        }
    }, []);

    function handleCreate(newNote) {
        const noteWithDate = {
            ...newNote,
            id: +new Date(),
            createdAt: new Date().toISOString(),
            archived: newNote.archived || false,
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

    // filter  dulu berdasarkan length
    const filtered = (filteredNotes.length > 0 ? filteredNotes : notes).filter(
        (note) =>

            // kemudian filter dan check keadan archivefilter dari function handleArchive(status)
            // setArchiveFilter(status) === archiveFilter
            archiveFilter === null ? true : note.archived === archiveFilter
    );

    return (
        <div className="container">
            <NotesControl onCreate={handleCreate} />
            <ComponentArchive onStatus={handleArchive} />
            <SearchComponent onSearch={handleSearch} />

            <div className="notes-wrapper">
                {filtered.length > 0 ? (
                    filtered.map((data) => (
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
