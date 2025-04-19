import React, { useState } from 'react';
import { Todo, TodoItemProps } from '../types';
import '../styles/ToDoItem.scss';

const ToDoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete, simplified = false }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...todo, text: e.target.value });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onUpdate({ ...todo, dueDate: date });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...todo, priority: e.target.value as 'important' | 'not-important' });
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...todo, urgency: e.target.value as 'low' | 'medium' | 'high' });
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

  // Format date for display
  const formatDateForDisplay = (date?: Date): string => {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date instanceof Date 
      ? date.toLocaleDateString(undefined, options) 
      : '';
  };

  const addSubtask = () => {
    if (!newSubtaskText.trim()) return;
    
    const newSubtask = {
      id: Date.now(),
      text: newSubtaskText,
      completed: false,
      priority: todo.priority,
      urgency: todo.urgency
    };
    
    const updatedTodo = {
      ...todo,
      subtasks: [...(todo.subtasks || []), newSubtask]
    };
    
    onUpdate(updatedTodo);
    setNewSubtaskText('');
  };

  const updateSubtask = (updatedSubtask: Todo) => {
    const updatedSubtasks = (todo.subtasks || []).map(subtask => 
      subtask.id === updatedSubtask.id ? updatedSubtask : subtask
    );
    onUpdate({ ...todo, subtasks: updatedSubtasks });
  };

  const deleteSubtask = (subtaskId: number) => {
    const updatedSubtasks = (todo.subtasks || []).filter(subtask => 
      subtask.id !== subtaskId
    );
    onUpdate({ ...todo, subtasks: updatedSubtasks });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${simplified ? 'simplified' : ''}`}>
      {simplified ? (
        // simple view for matrix
        <>
          <span className="todo-text">{todo.text}</span>
          <div className="todo-actions">
            {todo.dueDate && <span className="todo-date">{formatDateForDisplay(todo.dueDate)}</span>}
            <button onClick={toggleCompleted} className="complete-btn">
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => onDelete(todo.id)} className="delete-btn">
              Delete
            </button>
          </div>
        </>
      ) : (
        // full view for list
        <>
          <input type="text" value={todo.text} onChange={handleTextChange} />
          <input 
            type="date" 
            value={formatDateForInput(todo.dueDate)} 
            onChange={handleDueDateChange} 
          />
          <div className="todo-selects">
            <div className="select-group">
              <label>Priority:</label>
              <select value={todo.priority || 'not-important'} onChange={handlePriorityChange}>
                <option value="important">Important</option>
                <option value="not-important">Not Important</option>
              </select>
            </div>
            <div className="select-group">
              <label>Urgency:</label>
              <select value={todo.urgency || 'low'} onChange={handleUrgencyChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="todo-actions">
            <button onClick={toggleCompleted}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => onDelete(todo.id)} className="delete-btn">
              Delete
            </button>
          </div>
        </>
      )}

      {!simplified && (
        <div className="subtasks-section">
          <button 
            className="toggle-subtasks"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            {showSubtasks ? '▼' : '▶'} Subtasks ({todo.subtasks?.length || 0})
          </button>
          
          {showSubtasks && (
            <div className="subtasks-container">
              <div className="add-subtask">
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder="New subtask..."
                />
                <button onClick={addSubtask}>Add</button>
              </div>
              
              {todo.subtasks?.map(subtask => (
                <ToDoItem
                  key={subtask.id}
                  todo={subtask}
                  onUpdate={updateSubtask}
                  onDelete={deleteSubtask}
                  simplified={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToDoItem;