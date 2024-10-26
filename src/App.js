import React, { useState, useEffect } from 'react';
import { useTodo } from './TodoProvider';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Plus,
  Loader2,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  Check
} from 'lucide-react';
const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    id: task?._id || null,  
    title: task?.title || '',
    description: task?.description || '',
    date: task?.date ? format(task?.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: task?.startTime || '',
    endTime: task?.endTime || '',
    priority: task?.priority || 'Medium',
    completed: task?.completed || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose()
  };

  const inputClassName = "mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-x-0 bottom-0 flex justify-center items-end bg-black/20"
    >
      <div className="w-full md:w-2/3 lg:w-1/2 max-w-2xl bg-white rounded-t-3xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <button 
              type="button" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClassName}
              placeholder="Enter task title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={inputClassName}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClassName}
              rows="3"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className={inputClassName}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const TaskStats = () => {
  const { state } = useTodo();
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const thisWeekTasks = state.tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });
  
  const completedThisWeek = thisWeekTasks.filter(task => task.completed).length;
  const pendingThisWeek = thisWeekTasks.filter(task => !task.completed).length;
  
  const progressPercentage = thisWeekTasks.length > 0
    ? (completedThisWeek / thisWeekTasks.length) * 100
    : 0;

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">Task Complete</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">{completedThisWeek}</span>
            <span className="text-sm text-gray-500 ml-2">This Week</span>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">Task Pending</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">{pendingThisWeek}</span>
            <span className="text-sm text-gray-500 ml-2">This Week</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">Weekly Progress</h3>
          <span className="text-sm text-gray-500">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const WeekView = () => {
  const { state, dispatch } = useTodo();
  const today = new Date();
  const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

  const weekStart = startOfWeek(yesterday);

  console.log(weekStart)
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(today)
  });

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between">
        {weekDays.map((day, index) => {
          const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          return (
            <div
              key={index}
              className={`flex flex-col items-center ${
                isToday ? 'text-blue-600' : ''
              }`}
            >
              <span className="text-xs text-gray-500">
                {format(day, 'EEE')}
              </span>
              <span
                className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-blue-600 text-white' : ''
                }`}
              >
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TaskList = ({ tasks, setShowEditTask }) => {
  const { state, updateTask, deleteTask } = useTodo();
  
  const filteredTasks = state.searchQuery
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    : tasks;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="px-4 space-y-4">
      <AnimatePresence>
        {filteredTasks.map(task => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask(task._id, { completed: !task.completed })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {format(new Date(task.date), 'MMM d')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.startTime} - {task.endTime}
                    </span>
                    <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => setShowEditTask(task)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  const {
    state,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    searchTasks,
    showNewTask,
    setShowNewTask,
    showEditTask,
    setShowEditTask
  } = useTodo();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSubmit = (formData) => {
    if (formData.id) {
      // If we have an ID, it's an update
      updateTask(formData.id, formData);
      setShowEditTask(null);
    } else {
      // If no ID, it's a new task
      createTask(formData);
      setShowNewTask(false);
    }
  };
  const completedTasks = state.tasks.filter(task => task.completed);
  const pendingTasks = state.tasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search tasks..."
                onChange={(e) => searchTasks(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => setShowNewTask(true)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <WeekView />
            <TaskStats /> 

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Pending Tasks ({pendingTasks.length})
                </h2>
                <TaskList 
                  tasks={pendingTasks} 
                  setShowEditTask={setShowEditTask} 
                />
              </div>

              {completedTasks.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Completed Tasks ({completedTasks.length})
                  </h2>
                  <TaskList 
                    tasks={completedTasks} 
                    setShowEditTask={setShowEditTask} 
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
      {showNewTask && (
          <TaskForm
            onSubmit={handleTaskSubmit}
            onClose={() => setShowNewTask(false)}
          />
        )}
        {showEditTask && (
          <TaskForm
            task={showEditTask}
            onSubmit={handleTaskSubmit}
            onClose={() => setShowEditTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export {
  App as default,
  TaskForm,
  WeekView,
  TaskList
};