import React from 'react';
import { Todo } from '../types';
import ToDoItem from './ToDoItem';
import '../styles/Matrix.scss';

interface EisenhowerMatrixProps {
  todos: Todo[];
  onUpdate: (updatedTodo: Todo) => void;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ todos, onUpdate }) => {
  // quadrant filtering
  const importantUrgent = todos.filter(
    todo => (todo.priority === 'important') && (todo.urgency === 'high') && !todo.completed
  );
  
  const importantNotUrgent = todos.filter(
    todo => (todo.priority === 'important') && (todo.urgency !== 'high') && !todo.completed
  );
  
  const notImportantUrgent = todos.filter(
    todo => (todo.priority === 'not-important') && (todo.urgency === 'high') && !todo.completed
  );
  
  const notImportantNotUrgent = todos.filter(
    todo => (todo.priority === 'not-important') && (todo.urgency !== 'high') && !todo.completed
  );

  return (
    <div className="eisenhower-matrix">
      <div className="matrix-row">
        <div className="matrix-cell important-urgent">
          <h3>Important & Urgent</h3>
          <p>Do First</p>
          <div className="matrix-todos">
            {importantUrgent.length > 0 ? (
              importantUrgent.map(todo => (
                <ToDoItem key={todo.id} todo={todo} onUpdate={onUpdate} simplified={true} />
              ))
            ) : (
              <div className="no-todos">No tasks here</div>
            )}
          </div>
        </div>
        <div className="matrix-cell important-not-urgent">
          <h3>Important & Not Urgent</h3>
          <p>Schedule</p>
          <div className="matrix-todos">
            {importantNotUrgent.length > 0 ? (
              importantNotUrgent.map(todo => (
                <ToDoItem key={todo.id} todo={todo} onUpdate={onUpdate} simplified={true} />
              ))
            ) : (
              <div className="no-todos">No tasks here</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="matrix-row">
        <div className="matrix-cell not-important-urgent">
          <h3>Not Important & Urgent</h3>
          <p>Delegate</p>
          <div className="matrix-todos">
            {notImportantUrgent.length > 0 ? (
              notImportantUrgent.map(todo => (
                <ToDoItem key={todo.id} todo={todo} onUpdate={onUpdate} simplified={true} />
              ))
            ) : (
              <div className="no-todos">No tasks here</div>
            )}
          </div>
        </div>
        <div className="matrix-cell not-important-not-urgent">
          <h3>Not Important & Not Urgent</h3>
          <p>Eliminate</p>
          <div className="matrix-todos">
            {notImportantNotUrgent.length > 0 ? (
              notImportantNotUrgent.map(todo => (
                <ToDoItem key={todo.id} todo={todo} onUpdate={onUpdate} simplified={true} />
              ))
            ) : (
              <div className="no-todos">No tasks here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EisenhowerMatrix;