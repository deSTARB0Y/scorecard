import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import BroadcastView from './pages/BroadcastView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/view" element={<BroadcastView />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
