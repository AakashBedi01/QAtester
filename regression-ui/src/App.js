import React from 'react';
import Dashboard from './components/Dashboard';
import FlowForm from './components/FlowForm';
import TestReport from './components/TestReport';

const App = () => (
  <div className="App">
    <h1>Regression Testing Dashboard</h1>
    <FlowForm />
    <Dashboard />
    <TestReport />
  </div>
);

export default App;
