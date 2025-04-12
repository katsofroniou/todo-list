import React from 'react';
import '../styles/ToDoItem.scss';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
}

const ToDoItem: React.FC<TodoItemProps> = ({ todo, onUpdate }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...todo, text: e.target.value });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onUpdate({ ...todo, dueDate: date });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...todo, priority: e.target.value as 'low' | 'medium' | 'high' });
  };

  const toggleCompleted = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  // Format date for the date input (YYYY-MM-DD)
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date instanceof Date 
      ? date.toISOString().split('T')[0] 
      : '';
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input type="text" value={todo.text} onChange={handleTextChange} />
      <input 
        type="date" 
        value={formatDateForInput(todo.dueDate)} 
        onChange={handleDueDateChange} 
      />
      <select value={todo.priority} onChange={handlePriorityChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={toggleCompleted}>
        {todo.completed ? 'Undo' : 'Complete'}
      </button>
    </div>
  );
};

export default ToDoItem;