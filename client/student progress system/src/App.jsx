import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditStudent from './pages/EditStudent';
import ProfilePage from './pages/ProfilePage';
// import ProfilePage from './components/StudentProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students/:id" element={<ProfilePage />} />
        <Route path="/students/edit/:id" element={<EditStudent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
