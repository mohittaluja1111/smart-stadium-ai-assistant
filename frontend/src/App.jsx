import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="layout">
      <nav className="top-navbar">
        <h1>Smart Stadium AI Assistant</h1>
      </nav>
      <main className="main-content" style={{ flex: 1, padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
