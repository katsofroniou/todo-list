import React from 'react';
import ToDoList from './TodoList';
import '../styles/App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <ToDoList />
    </div>
  );
};

export default App;