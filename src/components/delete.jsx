export default function DeleteNote({ onDelete }) {

    return (
        <div>
            <button onClick={onDelete}>
                Hapus Note
            </button>
        </div>
    )
}