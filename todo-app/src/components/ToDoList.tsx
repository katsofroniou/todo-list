import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import EisenhowerMatrix from './Matrix';
import '../styles/ToDoList.scss';
import { Todo } from '../types';

// todo list component 
const ToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Default todo 
    return [{
      id: Date.now(),
      text: 'Click me to edit this task',
      completed: false,
      priority: 'important',
      urgency: 'high',
      dueDate: new Date(Date.now() + 86400000) // Tomorrow
    }];
  });
  const [showCompleted, setShowCompleted] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'important' | 'not-important'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');

  useEffect(() => {
    window.ipcRenderer.invoke('todos:get').then((storedTodos) => {
      if (storedTodos && storedTodos.length > 0) {
        const parsedTodos = storedTodos.map((todo: Todo) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }));
        setTodos(parsedTodos);
      }
      // If no stored todos, keep the default
    });
  }, []);

  useEffect(() => {
    const todosToStore = todos.map(todo => ({
      ...todo,
      dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined
    }));
    
    window.ipcRenderer.invoke('todos:set', todosToStore);
    
    window.ipcRenderer.invoke('todos:update-latest', todosToStore);
  }, [todos]);

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
    const newTodo: Todo = { 
      id: Date.now(), 
      text, 
      completed: false, 
      priority: 'not-important',
      urgency: 'low'
    };
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  };

  const sortedTodos = todos
    .filter(todo => {
      const completionMatch = todo.completed === showCompleted;
      const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;
      return completionMatch && priorityMatch;
    })
    .sort((a, b) => {
      if (a.priority === 'important' && b.priority !== 'important') return -1;
      if (a.priority !== 'important' && b.priority === 'important') return 1;
      
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return (urgencyOrder[b.urgency || 'low'] || 1) - (urgencyOrder[a.urgency || 'low'] || 1);
    });

  return (
    <div className="todo-list" role="main">
      <h1>Todo List</h1>
      <button type="button" onClick={() => addTodo('New Task')}>Add Todo</button>
      
      <div className="view-tabs">
        <button 
          onClick={() => setViewMode('list')} 
          className={viewMode === 'list' ? 'active' : ''}
        >
          List View
        </button>
        <button 
          onClick={() => setViewMode('matrix')} 
          className={viewMode === 'matrix' ? 'active' : ''}
        >
          Eisenhower Matrix
        </button>
      </div>
      
      {viewMode === 'list' ? (
        <>
          <div className="filters">
            <div className="tabs">
              <button onClick={() => setShowCompleted(false)} className={!showCompleted ? 'active' : ''}>
                Not Completed
              </button>
              <button onClick={() => setShowCompleted(true)} className={showCompleted ? 'active' : ''}>
                Completed
              </button>
            </div>
            
            <div className="priority-filter">
              <label>Priority Filter:</label>
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'important' | 'not-important')}
              >
                <option value="all">All Priorities</option>
                <option value="important">Important</option>
                <option value="not-important">Not Important</option>
              </select>
            </div>
          </div>
          
          <div className="todo-content">
            {sortedTodos.length > 0 ? (
              sortedTodos.map(todo => (
                <ToDoItem key={todo.id} todo={todo} onUpdate={updateTodo} />
              ))
            ) : (
              <div className="no-todos">No matching todos found</div>
            )}
          </div>
        </>
      ) : (
        <EisenhowerMatrix todos={todos} onUpdate={updateTodo} />
      )}
    </div>
  );
};

export default ToDoList;