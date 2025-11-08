import { useState } from "react";
import '../styles/search.css'
export default function SearchComponent({ onSearch }) {
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        onSearch(search);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch(search);
        }
    };

    return (
        <div className="search-wrapper">
            <label htmlFor="search" className="search-label">
                <h3 className="search-title">Search</h3>
            </label>

            <div className="search-bar">
                <input
                    id="search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                    placeholder="Cari catatan..."
                />
                <button className="search-button" onClick={handleSearch}>
                    Cari
                </button>
            </div>
        </div>

    );
}
