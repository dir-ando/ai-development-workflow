'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks: Subtask[];
  isEditing: boolean;
  showSubtasks: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // タスクの追加
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subtasks: [],
        isEditing: false,
        showSubtasks: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  // タスクの削除
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // タスクの編集開始
  const startEditingTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isEditing: true } : task
    ));
  };

  // タスクの編集完了
  const finishEditingTask = (taskId: string, newTitle: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle, isEditing: false } : task
    ));
  };

  // タスクのステータス変更
  const changeTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // サブタスクの表示切り替え
  const toggleSubtasks = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, showSubtasks: !task.showSubtasks } : task
    ));
  };

  // サブタスクの追加
  const addSubtask = (taskId: string, subtaskTitle: string) => {
    if (subtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        status: 'Pending',
      };
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      ));
    }
  };

  // サブタスクの削除
  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(st => st.id !== subtaskId) }
        : task
    ));
  };

  // サブタスクの編集
  const editSubtask = (taskId: string, subtaskId: string, newTitle: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, title: newTitle } : st
            )
          }
        : task
    ));
  };

  // サブタスクのステータス変更
  const changeSubtaskStatus = (taskId: string, subtaskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, status: newStatus } : st
            )
          }
        : task
    ));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'Running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
          TODO管理アプリ
        </h1>

        {/* タスク追加フォーム */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              追加
            </button>
          </div>
        </div>

        {/* タスクリスト */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  {task.isEditing ? (
                    <input
                      type="text"
                      defaultValue={task.title}
                      onBlur={(e) => finishEditingTask(task.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          finishEditingTask(task.id, e.currentTarget.value);
                        }
                      }}
                      autoFocus
                      className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <h3
                      onClick={() => startEditingTask(task.id)}
                      className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {task.title}
                    </h3>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => changeTaskStatus(task.id, e.target.value as TaskStatus)}
                    className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${getStatusColor(task.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => toggleSubtasks(task.id)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    {task.showSubtasks ? '▼' : '▶'} サブタスク ({task.subtasks.length})
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    削除
                  </button>
                </div>
              </div>

              {/* サブタスクセクション */}
              {task.showSubtasks && (
                <div className="mt-4 ml-4 space-y-3">
                  <SubtaskForm
                    onAdd={(title) => addSubtask(task.id, title)}
                  />

                  {task.subtasks.map((subtask) => (
                    <SubtaskItem
                      key={subtask.id}
                      subtask={subtask}
                      onDelete={() => deleteSubtask(task.id, subtask.id)}
                      onEdit={(newTitle) => editSubtask(task.id, subtask.id, newTitle)}
                      onStatusChange={(newStatus) => changeSubtaskStatus(task.id, subtask.id, newStatus)}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            タスクがありません。上記のフォームから新しいタスクを追加してください。
          </div>
        )}
      </div>
    </div>
  );
}

// サブタスク追加フォームコンポーネント
function SubtaskForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [subtaskTitle, setSubtaskTitle] = useState('');

  const handleAdd = () => {
    if (subtaskTitle.trim()) {
      onAdd(subtaskTitle);
      setSubtaskTitle('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={subtaskTitle}
        onChange={(e) => setSubtaskTitle(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="サブタスクを追加..."
        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:text-white"
      />
      <button
        onClick={handleAdd}
        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
      >
        追加
      </button>
    </div>
  );
}

// サブタスクアイテムコンポーネント
function SubtaskItem({
  subtask,
  onDelete,
  onEdit,
  onStatusChange,
  getStatusColor,
}: {
  subtask: Subtask;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
  onStatusChange: (newStatus: TaskStatus) => void;
  getStatusColor: (status: TaskStatus) => string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center gap-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
      {isEditing ? (
        <input
          type="text"
          defaultValue={subtask.title}
          onBlur={(e) => {
            onEdit(e.target.value);
            setIsEditing(false);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onEdit(e.currentTarget.value);
              setIsEditing(false);
            }
          }}
          autoFocus
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:text-white"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className="flex-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-200"
        >
          {subtask.title}
        </span>
      )}

      <select
        value={subtask.status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(subtask.status)}`}
      >
        <option value="Pending">Pending</option>
        <option value="Running">Running</option>
        <option value="Completed">Completed</option>
      </select>

      <button
        onClick={onDelete}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
      >
        削除
      </button>
    </div>
  );
}
