import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import EisenhowerMatrix from './Matrix';
import '../styles/ToDoList.scss';
import { Todo, ViewMode } from '../types';
import { debounce } from 'lodash';

// todo list component 
const ToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([{
    id: Date.now(),
    text: 'Click me to edit this task',
    completed: false,
    priority: 'important',
    urgency: 'high',
    dueDate: new Date(Date.now() + 86400000) // Tomorrow
  }]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'important' | 'not-important'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    // Load initial todos when component mounts
    const loadInitialTodos = async () => {
      try {
        const initialTodos = await window.ipcRenderer.invoke('todos:get');
        console.log('Received initial todos:', initialTodos);
        if (Array.isArray(initialTodos) && initialTodos.length > 0) {
          // Convert ISO date strings back to Date objects
          const processedTodos = initialTodos.map(todo => ({
            ...todo,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
          }));
          setTodos(processedTodos);
        }
      } catch (error) {
        console.error('Error loading initial todos:', error);
      }
    };

    loadInitialTodos();

    // Listen for todos-updated events
    const handleTodosUpdated = (_event: any, updatedTodos: any[]) => {
      console.log('Received todos-updated event:', updatedTodos);
      if (Array.isArray(updatedTodos)) {
        const processedTodos = updatedTodos.map(todo => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }));
        setTodos(processedTodos);
      }
    };

    window.ipcRenderer.on('todos-updated', handleTodosUpdated);

    return () => {
      window.ipcRenderer.removeAllListeners('todos-updated');
    };
  }, []);

  useEffect(() => {
    const debouncedSave = debounce((todosToSave: Todo[]) => {
      const processedTodos = todosToSave.map((todo: Todo) => ({
        ...todo,
        dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined
      }));
      window.ipcRenderer.invoke('todos:set', processedTodos);
      window.ipcRenderer.invoke('todos:update-latest', processedTodos);
    }, 1000);

    debouncedSave(todos);

    return () => {
      debouncedSave.cancel();
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

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
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
                <ToDoItem 
                  key={todo.id} 
                  todo={todo} 
                  onUpdate={updateTodo} 
                  onDelete={deleteTodo}
                  simplified={viewMode === ('matrix' as ViewMode)} 
                />
              ))
            ) : (
              <div className="no-todos">No matching todos found</div>
            )}
          </div>
        </>
      ) : (
        <EisenhowerMatrix 
          todos={todos} 
          onUpdate={updateTodo} 
          onDelete={deleteTodo}
        />
      )}
    </div>
  );
};

export default ToDoList;