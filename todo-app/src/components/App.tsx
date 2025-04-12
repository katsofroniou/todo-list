import React from 'react';
import ToDoList from './ToDoList';
import TitleBar from './TitleBar';
import ErrorBoundary from './ErrorBoundary';
import '../styles/App.scss';

const App: React.FC = () => {
  return (
    <div className="App-container">
      <TitleBar />
      <div className="App">
        <ErrorBoundary>
          <ToDoList />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;