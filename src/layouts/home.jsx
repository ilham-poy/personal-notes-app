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
    const [updatedNotes, setUpdatedNotes] = useState();

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem('notes'));

        //cek ada data di local storage
        if (savedNotes && savedNotes.length > 0) {
            setNotes(savedNotes);


        } else {// kalo ga ada buat itemnya
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
        //cek kalo keyword kosong maka return
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
        const filtered = notes.filter(note => note.archived === status);
        setFilteredNotes(filtered);
    }


    const displayNotes = filteredNotes.length > 0 ? filteredNotes : notes;

    return (
        <div className="container">
            <NotesControl onCreate={handleCreate} />
            <ComponentArchive onStatus={handleArchive} />
            <SearchComponent onSearch={handleSearch} />

            <div className="notes-wrapper">
                {displayNotes.length > 0 ? (
                    displayNotes.map((data) => (
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
