import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import DeleteNote from './delete';
export default function DetailNotePage() {
    const { id } = useParams();
    const location = useLocation();
    const [detailDataNote, setDetailNote] = useState(null);
    const [notes, setNotes] = useState([])
    //  Jika tidak ada state, ambil dari localStorage
    useEffect(() => {
        const allNotes = JSON.parse(localStorage.getItem('notes')) || [];

        const foundNote = allNotes.find(
            (note) => String(note.id) === String(id)
        );
        setDetailNote(foundNote);
    }, [notes]);

    if (!detailDataNote) {
        return <p>Note tidak ditemukan.</p>;
    }

    function handleDelete(id) {
        const updatedNotes = notes.filter((note) => note.id !== id)
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        setTimeout(() => {
            window.location.href = '/';
        }, 300);
    }



    return (
        <div className="note-detail-container">
            <div className="note-header">
                <h1 className="note-title">{detailDataNote.title}</h1>
            </div>

            <div className="note-meta">
                Dibuat pada:{' '}
                {new Date(detailDataNote.createdAt).toLocaleDateString('id-ID')}
            </div>

            <div className="note-content">
                <p>{detailDataNote.body}</p>
            </div>

            <div className="note-actions">
                <DeleteNote onDelete={() => handleDelete(detailDataNote.id)} />

                <Link className="note-back-btn" to={`/`}>
                    Kembali
                </Link>
            </div>
        </div>
    );
}
