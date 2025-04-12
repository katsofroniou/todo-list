export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date;
  priority?: 'important' | 'not-important';
  urgency?: 'low' | 'medium' | 'high';
}

export interface StoredTodo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'important' | 'not-important';
  urgency?: 'low' | 'medium' | 'high';
}

export interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  simplified?: boolean;
}