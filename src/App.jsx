import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentViewPage } from './pages/DocumentViewPage';
import { ClientViewPage } from './pages/ClientViewPage';
import './App.css'

// Wrapper component to provide key based on documentId
const DocumentViewPageWrapper = () => {
  const { documentId } = useParams();
  return <DocumentViewPage key={documentId} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DocumentsPage />} />
        <Route path="/document/:documentId" element={<DocumentViewPageWrapper />} />
        <Route path="/client/:clientId" element={<ClientViewPage />} />
      </Routes>
    </Router>
  )
}

export default App
