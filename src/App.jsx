import HomePage from "./layouts/home";
import { Routes, Route } from 'react-router-dom';
import DetailNotePage from "./components/detail";
function App() {

  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/note/:id" element={<DetailNotePage />} />
    </Routes>
  );
}

export default App;
