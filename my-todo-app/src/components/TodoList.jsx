import React, { useState, useEffect } from 'react';
import '../index.scss';

function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateCounters = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const uncompletedTasks = tasks.length - completedTasks;
    return { completedTasks, uncompletedTasks };
  };

  const addTask = () => {
    const task = inputValue.trim();
    if (!task) {
      alert("Please write down a task");
      return;
    }

    setTasks([...tasks, { text: task, completed: false }]);
    setInputValue('');
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const editTask = (index) => {
    const update = prompt("Edit task:", tasks[index].text);
    if (update !== null) {
      const newTasks = tasks.map((task, i) => 
        i === index ? { ...task, text: update, completed: false } : task
      );
      setTasks(newTasks);
    }
  };

  const deleteTask = (index) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const { completedTasks, uncompletedTasks } = updateCounters();

  return (
    <div id="todo-container" className="todo-container">
      <div id="header">
        <h1>To Do List</h1>
      </div>

      <div id="todo-form">
        <input
          type="text"
          className="input-item"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add Task"
          onKeyUp={(e) => e.key === 'Enter' && addTask()}
        />
        <button id="input-button" onClick={addTask}>Add</button>
      </div>

      <h2>Task List</h2>
      <ul id="list-container">
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index)}
              />
              <span>{task.text}</span>
            </label>
            <span className="edit-btn" onClick={() => editTask(index)}>Edit</span>
            <span className="delete-btn" onClick={() => deleteTask(index)}>Delete</span>
          </li>
        ))}
      </ul>

      <hr />

      <div className="counter-container">
        <div id="task-counters">
          Completed: <span id="completed-counter">{completedTasks}</span> | Uncompleted: <span id="uncompleted-counter">{uncompletedTasks}</span>
        </div>
      </div>
    </div>
  );
}

export default TodoList; 