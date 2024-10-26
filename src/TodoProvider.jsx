import React, { createContext, useContext, useReducer, useState } from 'react';

// Create Context
const TodoContext = createContext();

const INITIAL_STATE = {
  tasks: [],
  selectedWeek: null,
  searchQuery: '',
};

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state, 
        tasks: state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload)
      };
    case 'SET_SELECTED_WEEK':
      return { ...state, selectedWeek: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

// Provider Component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, INITIAL_STATE);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = "https://digiaccel-backend-8a1k.onrender.com"

  // API Functions
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/tasks`);
      const data = await response.json();
      dispatch({ type: 'SET_TASKS', payload: data });
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const newTask = await response.json();
      dispatch({ type: 'ADD_TASK', payload: newTask });
      setShowNewTask(false);
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const updatedTask = await response.json();
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      setShowEditTask(null);
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setIsLoading(true);
      await fetch(`${apiUrl}/api/tasks/${id}`, { method: 'DELETE' });
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  const searchTasks = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  return (
    <TodoContext.Provider value={{
      state,
      dispatch,
      showNewTask,
      setShowNewTask,
      showEditTask,
      setShowEditTask,
      isLoading,
      error,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      searchTasks
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);

export default TodoProvider;