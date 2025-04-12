import { app } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

// Define StoredTodo interface here since it's not in types.ts
export interface StoredTodo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

const storePath = path.join(app.getPath('userData'), 'todos.json')

export const store = {
  get(): StoredTodo[] {
    try {
      return JSON.parse(fs.readFileSync(storePath, 'utf8'))
    } catch (error) {
      return []
    }
  },

  set(todos: StoredTodo[]) {
    fs.writeFileSync(storePath, JSON.stringify(todos))
  }
}