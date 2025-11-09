import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/design-system/atoms/Button/Button';
import './HomePage.css';

function HomePage() {
  const [homeFilter, setHomeFilter] = useState('all');
  const [itemsToShow, setItemsToShow] = useState(4);

  const allLinks = [
    { to: "/showcase", title: "🚀 Component Showcase", description: "Ready-to-use React components for rapid prototyping" },
    { to: "/transactions", title: "💰 Transactions Demo", description: "Example page with IN/OUT/All selector and filtering" },
    { to: "/colors", title: "🎨 Color Research", description: "Explore and test the design system colors on various components" },
    { to: "/documents", title: "📄 Documents", description: "View and manage transport documents" },
    { to: "/test-table", title: "📊 Test Table", description: "Test page for table components and examples" },
    { to: "/showcase", title: "🔧 Components Library", description: "Browse all available components in the design system" },
    { to: "/transactions", title: "📈 Analytics", description: "View transaction analytics and insights" },
    { to: "/documents", title: "📋 Templates", description: "Document templates and examples" },
    { to: "/showcase", title: "🎯 Patterns", description: "Design patterns and best practices" },
    { to: "/colors", title: "🌈 Theme Builder", description: "Customize and build your own theme" },
    { to: "/documents", title: "📝 Forms", description: "Form components and validation examples" },
    { to: "/test-table", title: "🗂️ Data Tables", description: "Advanced table components and data visualization" },
  ];

  const visibleLinks = allLinks.slice(0, itemsToShow);
  const hasMore = itemsToShow < allLinks.length;

  const handleShowMore = () => {
    setItemsToShow(prev => Math.min(prev + 4, allLinks.length));
  };

  return (
    <div className="home-page">
      <BackButton />
      <div className="home-content">
        <h1>Luna Design System</h1>
        <p>Welcome to the Luna design system workspace</p>
        
        <div className="home-toggle-selector">
          <button
            className={`home-toggle-option ${homeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setHomeFilter('all')}
          >
            All
          </button>
          <button
            className={`home-toggle-option ${homeFilter === 'in' ? 'active' : ''}`}
            onClick={() => setHomeFilter('in')}
          >
            IN
          </button>
          <button
            className={`home-toggle-option ${homeFilter === 'out' ? 'active' : ''}`}
            onClick={() => setHomeFilter('out')}
          >
            OUT
          </button>
        </div>
        
        <div className="home-links">
          {visibleLinks.map((link, index) => (
            <Link key={index} to={link.to} className="home-link">
              <div className="link-card">
                <h2>{link.title}</h2>
                <p>{link.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="home-show-more">
            <Button
              variant="default"
              size="md"
              onClick={handleShowMore}
            >
              Show More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

