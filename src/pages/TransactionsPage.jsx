import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { Card, Badge } from '../components/ui';
import './TransactionsPage.css';

function TransactionsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample transaction data
  const transactions = [
    { id: 1, type: 'in', amount: '$1,250.00', description: 'Payment received', date: '2024-11-04', status: 'completed' },
    { id: 2, type: 'out', amount: '$450.00', description: 'Subscription payment', date: '2024-11-03', status: 'completed' },
    { id: 3, type: 'in', amount: '$3,500.00', description: 'Client payment', date: '2024-11-02', status: 'completed' },
    { id: 4, type: 'out', amount: '$125.00', description: 'Software license', date: '2024-11-01', status: 'pending' },
    { id: 5, type: 'in', amount: '$890.00', description: 'Invoice #1234', date: '2024-10-31', status: 'completed' },
    { id: 6, type: 'out', amount: '$2,100.00', description: 'Office supplies', date: '2024-10-30', status: 'completed' },
    { id: 7, type: 'in', amount: '$5,200.00', description: 'Project milestone', date: '2024-10-29', status: 'completed' },
    { id: 8, type: 'out', amount: '$75.00', description: 'Cloud hosting', date: '2024-10-28', status: 'completed' },
  ];

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  // Calculate totals
  const inTotal = transactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);
  
  const outTotal = transactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);

  return (
    <div className="transactions-page">
      <BackButton />
      <header className="transactions-header">
        <h1>Transactions</h1>
        <p>View and manage your transactions</p>
      </header>

      <div className="transactions-content">
        {/* Summary Cards */}
        <div className="summary-grid">
          <Card className="summary-card in-card">
            <div className="summary-label">Total In</div>
            <div className="summary-amount in">${inTotal.toLocaleString()}</div>
            <div className="summary-count">{transactions.filter(t => t.type === 'in').length} transactions</div>
          </Card>
          
          <Card className="summary-card out-card">
            <div className="summary-label">Total Out</div>
            <div className="summary-amount out">${outTotal.toLocaleString()}</div>
            <div className="summary-count">{transactions.filter(t => t.type === 'out').length} transactions</div>
          </Card>
          
          <Card className="summary-card balance-card">
            <div className="summary-label">Net Balance</div>
            <div className={`summary-amount ${inTotal - outTotal >= 0 ? 'in' : 'out'}`}>
              ${Math.abs(inTotal - outTotal).toLocaleString()}
            </div>
            <div className="summary-count">{inTotal - outTotal >= 0 ? 'Positive' : 'Negative'}</div>
          </Card>
        </div>

        {/* Filter Selector */}
        <Card className="filter-card">
          <div className="filter-selector">
            <button
              className={`filter-button ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              <span className="filter-icon">📊</span>
              <span className="filter-label">All</span>
              <Badge variant="subtle" size="sm">{transactions.length}</Badge>
            </button>
            
            <button
              className={`filter-button ${selectedFilter === 'in' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('in')}
            >
              <span className="filter-icon in">↓</span>
              <span className="filter-label">In</span>
              <Badge variant="subtle" size="sm">{transactions.filter(t => t.type === 'in').length}</Badge>
            </button>
            
            <button
              className={`filter-button ${selectedFilter === 'out' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('out')}
            >
              <span className="filter-icon out">↑</span>
              <span className="filter-label">Out</span>
              <Badge variant="subtle" size="sm">{transactions.filter(t => t.type === 'out').length}</Badge>
            </button>
          </div>
        </Card>

        {/* Transactions List */}
        <div className="transactions-list">
          {filteredTransactions.length === 0 ? (
            <Card className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No transactions found</h3>
              <p>There are no {selectedFilter !== 'all' ? selectedFilter : ''} transactions to display.</p>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} hoverable className="transaction-item">
                <div className="transaction-content">
                  <div className="transaction-icon-wrapper">
                    <div className={`transaction-icon ${transaction.type}`}>
                      {transaction.type === 'in' ? '↓' : '↑'}
                    </div>
                  </div>
                  
                  <div className="transaction-details">
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-date">{transaction.date}</div>
                  </div>
                  
                  <div className="transaction-right">
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'in' ? '+' : '-'}{transaction.amount}
                    </div>
                    <Badge 
                      variant={transaction.status === 'completed' ? 'subtle' : 'outline'}
                      size="sm"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
