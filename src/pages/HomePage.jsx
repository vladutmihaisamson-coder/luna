import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/design-system/atoms/Button/Button';
import { FilterPillGroup } from '../components/design-system';
import './HomePage.css';

function HomePage() {
  const [itemsToShow, setItemsToShow] = useState(4);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [filters, setFilters] = useState([
    {
      id: 'category',
      title: 'Category',
      placeholder: 'What type of page?',
      options: [
        { value: 'components', label: 'Components' },
        { value: 'pages', label: 'Pages' },
        { value: 'tools', label: 'Tools' },
        { value: 'examples', label: 'Examples' },
      ],
      selectedValue: null,
    },
    {
      id: 'type',
      title: 'Type',
      placeholder: 'What type?',
      options: [
        { value: 'showcase', label: 'Showcase' },
        { value: 'demo', label: 'Demo' },
        { value: 'research', label: 'Research' },
        { value: 'test', label: 'Test' },
      ],
      selectedValue: null,
    },
  ]);

  const allLinks = [
    { to: "/showcase", title: "🚀 Component Showcase", description: "Ready-to-use React components for rapid prototyping", category: "components", type: "showcase" },
    { to: "/transactions", title: "💰 Transactions Demo", description: "Example page with IN/OUT/All selector and filtering", category: "pages", type: "demo" },
    { to: "/colors", title: "🎨 Color Research", description: "Explore and test the design system colors on various components", category: "tools", type: "research" },
    { to: "/documents", title: "📄 Documents", description: "View and manage transport documents", category: "pages", type: "demo" },
    { to: "/test-table", title: "📊 Test Table", description: "Test page for table components and examples", category: "examples", type: "test" },
    { to: "/showcase", title: "🔧 Components Library", description: "Browse all available components in the design system", category: "components", type: "showcase" },
    { to: "/transactions", title: "📈 Analytics", description: "View transaction analytics and insights", category: "pages", type: "demo" },
    { to: "/documents", title: "📋 Templates", description: "Document templates and examples", category: "pages", type: "examples" },
    { to: "/showcase", title: "🎯 Patterns", description: "Design patterns and best practices", category: "components", type: "showcase" },
    { to: "/colors", title: "🌈 Theme Builder", description: "Customize and build your own theme", category: "tools", type: "research" },
    { to: "/documents", title: "📝 Forms", description: "Form components and validation examples", category: "components", type: "examples" },
    { to: "/test-table", title: "🗂️ Data Tables", description: "Advanced table components and data visualization", category: "examples", type: "test" },
  ];

  const filteredLinks = useMemo(() => {
    let filtered = [...allLinks];

    // Filter by category
    const categoryFilter = filters.find(f => f.id === 'category');
    if (categoryFilter?.selectedValue) {
      filtered = filtered.filter(link => link.category === categoryFilter.selectedValue);
    }

    // Filter by type
    const typeFilter = filters.find(f => f.id === 'type');
    if (typeFilter?.selectedValue) {
      filtered = filtered.filter(link => link.type === typeFilter.selectedValue);
    }

    // Filter by search
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(query) || 
        link.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [filters, searchValue]);

  const visibleLinks = filteredLinks.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredLinks.length;

  const handleShowMore = () => {
    setItemsToShow(prev => Math.min(prev + 4, filteredLinks.length));
  };

  const handleFilterChange = (filterId, value) => {
    setFilters(prev => 
      prev.map(filter => 
        filter.id === filterId 
          ? { ...filter, selectedValue: value }
          : filter
      )
    );
    setItemsToShow(4); // Reset pagination
  };

  const handleResetFilters = () => {
    setFilters(prev => 
      prev.map(filter => ({ ...filter, selectedValue: null }))
    );
    setSearchValue('');
    setIsSearchExpanded(false);
    setItemsToShow(4);
  };

  return (
    <div className="home-page">
      <BackButton />
      <div className="home-content">
        <h1>Luna Design System</h1>
        <p>Welcome to the Luna design system workspace</p>
        
        <div className="home-filter-group">
          <FilterPillGroup
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            showResetButton={true}
            showSearchButton={true}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchToggle={setIsSearchExpanded}
            isSearchExpanded={isSearchExpanded}
            showMoreButton={false}
          />
        </div>
        
        {visibleLinks.length === 0 ? (
          <EmptyState
            icon="search"
            title="No results found"
            message="Try adjusting your search or filters to see more results."
          />
        ) : (
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
        )}

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

