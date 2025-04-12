import React from 'react';
import ToDoList from './ToDoList';
import '../styles/App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <ToDoList />
    </div>
  );
};

export default App;