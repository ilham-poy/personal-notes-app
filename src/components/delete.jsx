export default function DeleteNote({ onDelete }) {

    return (
        <div>
            <button onClick={onDelete}>
                🗑️ Delete Note
            </button>
        </div>
    )
}