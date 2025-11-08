import { Link } from 'react-router-dom';
import '../styles/not-found.css';
export default function NotFoundPage() {
    return (
        <div className="not-found-container">
            <h1>404 - Halaman Tidak Ditemukan</h1>
            <p>Maaf, halaman yang kamu cari tidak tersedia.</p>
            <Link to="/" className="back-home-link">Kembali ke Beranda</Link>
        </div>
    );
}
