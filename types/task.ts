// Interface for defining the structure of a location
export interface Location {
    latitude: number;
    longitude: number;
    radius: number; // in meters
  }
  
  // Interface for defining the structure of a task
  export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    location: Location;
    triggerTime?: string; // Optional time-based trigger (e.g., "08:00")
    isComplete: boolean;
    isRecurring: boolean;
    createdAt: number;
    completedAt?: number;
  }
  
  // Type definition for the task store, which manages tasks
  export type TaskStore = {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isComplete' | 'completedAt'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    completeTask: (id: string) => void;
  };