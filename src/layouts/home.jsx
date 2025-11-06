import { useState } from 'react';
import { getInitialData, showFormattedDate } from '../utils';

import '../App.css';
import NotesControl from '../components/create';
import DeleteNote from '../components/delete';
import SearchComponent from '../components/search';
import { Link } from 'react-router-dom';
export default function HomePage() {
    const [notes, setNotes] = useState(getInitialData());
    const [filteredNotes, setFilteredNotes] = useState([]);

    function handleCreate(newNote) {
        const noteWithDate = {
            ...newNote,
            id: +new Date(),
            createdAt: new Date().toISOString()
        };
        setNotes(prevNotes => [...prevNotes, noteWithDate]);
    }

    function handleDelete(id) {
        // jadi ini filter untuk mengetahui note yang berbeda dan yang berbeda akan masuk ke setnotes 
        // menjadi data baru, sedangakan note yang sama akan tidak terfilter artinya akan terhapus
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
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

    const displayNotes = filteredNotes.length > 0 ? filteredNotes : notes;

    return (

        <div className="container">
            <NotesControl onCreate={handleCreate} />
            <SearchComponent onSearch={handleSearch} />

            <div className="notes-wrapper">
                {displayNotes.map((data) => (
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
                            <div className="card-date">{showFormattedDate(data.createdAt)}</div>
                        </div>
                        <Link to={`/note/${data.id}`}>Detail</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}