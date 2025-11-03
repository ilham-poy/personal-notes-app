import { useState } from "react";

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
                <h3>
                    Search
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                        placeholder="Cari catatan..."
                    />
                    <button onClick={handleSearch}>Cari</button>
                </h3>
            </label>
        </div>
    );
}
