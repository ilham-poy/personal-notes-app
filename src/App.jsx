import HomePage from "./layouts/home";
import { Routes, Route } from 'react-router-dom';
import DetailNotePage from "./components/detail";
import NotFoundPage from "./layouts/404";
function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/note/:id" element={<DetailNotePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
