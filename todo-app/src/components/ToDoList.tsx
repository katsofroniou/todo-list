import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import '../styles/ToDoList.scss';
import { Todo } from '../types';

// todo list component 
const ToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    window.ipcRenderer.invoke('todos:get').then((storedTodos) => {
      const parsedTodos = storedTodos.map((todo: Todo) => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
      setTodos(parsedTodos);
    });
  }, []);

  // save on change
  useEffect(() => {
    const todosToStore = todos.map(todo => ({
      ...todo,
      dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined
    }));
    
    // Save to store
    window.ipcRenderer.invoke('todos:set', todosToStore);
    
    // Also update the latest todos in the main process for saving on close
    window.ipcRenderer.invoke('todos:update-latest', todosToStore);
  }, [todos]);

  // Add event listener for beforeunload to ensure saving before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const todosToStore = todos.map(todo => ({
        ...todo,
        dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined
      }));
      window.ipcRenderer.invoke('todos:set', todosToStore);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false, priority: 'low' };
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  };

  const sortedTodos = todos
    .filter(todo => todo.completed === showCompleted)
    .sort((a, b) => {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return (priorityOrder[b.priority || 'low'] || 1) - (priorityOrder[a.priority || 'low'] || 1);
    });

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <button onClick={() => addTodo('New Task')}>Add Todo</button>
      <div className="tabs">
        <button onClick={() => setShowCompleted(false)} className={!showCompleted ? 'active' : ''}>
          Not Completed
        </button>
        <button onClick={() => setShowCompleted(true)} className={showCompleted ? 'active' : ''}>
          Completed
        </button>
      </div>
      {sortedTodos.map(todo => (
        <ToDoItem key={todo.id} todo={todo} onUpdate={updateTodo} />
      ))}
    </div>
  );
};

export default ToDoList;