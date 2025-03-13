// Import necessary modules
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStore } from '@/types/task';

// Define the storage key for tasks
const TASKS_STORAGE_KEY = '@tasks';

// Define the useTaskStore hook
export function useTaskStore(): TaskStore {
  // Initialize the tasks state
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from AsyncStorage on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Function to save tasks to AsyncStorage
  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Function to add a new task
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'isComplete' | 'completedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      isComplete: false,
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Function to update an existing task
  const updateTask = (id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Function to delete a task
  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Function to complete a task
  const completeTask = (id: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            isComplete: true,
            completedAt: Date.now(),
          }
        : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Return the task store object
  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  };
}