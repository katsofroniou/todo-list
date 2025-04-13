import React from 'react';
import ToDoList from './ToDoList';
import TitleBar from './TitleBar';
import ErrorBoundary from './ErrorBoundary';
import '../styles/App.scss';

const App: React.FC = () => {
  return (
    <>
      <TitleBar />
      <ErrorBoundary>
        <ToDoList />
      </ErrorBoundary>
    </>
  );
};

export default App;