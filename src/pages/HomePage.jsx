import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <BackButton />
      <div className="home-content">
        <h1>Luna Design System</h1>
        <p>Welcome to the Luna design system workspace</p>
        
        <div className="home-links">
          <Link to="/showcase" className="home-link">
            <div className="link-card">
              <h2>🚀 Component Showcase</h2>
              <p>Ready-to-use React components for rapid prototyping</p>
            </div>
          </Link>
          <Link to="/transactions" className="home-link">
            <div className="link-card">
              <h2>💰 Transactions Demo</h2>
              <p>Example page with IN/OUT/All selector and filtering</p>
            </div>
          </Link>
          <Link to="/colors" className="home-link">
            <div className="link-card">
              <h2>🎨 Color Research</h2>
              <p>Explore and test the design system colors on various components</p>
            </div>
          </Link>
          <Link to="/documents" className="home-link">
            <div className="link-card">
              <h2>📄 Documents</h2>
              <p>View and manage transport documents</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

