import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ColorResearch from './pages/ColorResearch';
import ComponentShowcase from './pages/ComponentShowcase';
import TransactionsPage from './pages/TransactionsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentViewPage } from './pages/DocumentViewPage';
import { ClientViewPage } from './pages/ClientViewPage';
import { TestTablePage } from './pages/TestTablePage';
import { TableComponentsShowcasePage } from './pages/TableComponentsShowcasePage';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/colors" element={<ColorResearch />} />
        <Route path="/showcase" element={<ComponentShowcase />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/document/:documentId" element={<DocumentViewPage />} />
        <Route path="/client/:clientId" element={<ClientViewPage />} />
        <Route path="/table-components-showcase" element={<TableComponentsShowcasePage />} />
        <Route path="/test-table" element={<TestTablePage />} />
      </Routes>
    </Router>
  )
}

export default App
