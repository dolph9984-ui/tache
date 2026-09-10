import { useState } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { TasksProvider, useTasks } from './context/TasksContext';
import { useReminders } from './hooks/useReminders';
import AppHeader from './components/layout/AppHeader';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './components/dashboard/Dashboard';
import TasksView from './components/tasks/TasksView';
import ArchivesView from './components/archives/ArchivesView';
import SettingsView from './components/settings/SettingsView';
import TaskDrawer from './components/drawer/TaskDrawer';

const TASKS_FILTER_KEYS = ['done', 'pending', 'missed', 'postponed'];

function AppShell() {
  const { tasks, addTask, updateTask, deleteTask, postponeToTomorrow } = useTasks();
  const { settings } = useSettings();
  useReminders(tasks, settings);

  const [view, setView] = useState('dashboard');
  const [tasksFilter, setTasksFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawer, setDrawer] = useState({ open: false, mode: 'create', task: null });

  const openDrawer = (mode, task = null) => setDrawer({ open: true, mode, task });
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));

  const goToTasks = (filter) => {
    setTasksFilter(TASKS_FILTER_KEYS.includes(filter) ? filter : 'all');
    setView('tasks');
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.trim()) setView('tasks');
  };

  const handleSave = (fields) => {
    if (drawer.mode === 'edit' && drawer.task) updateTask(drawer.task.id, fields);
    else addTask(fields);
  };

  return (
    <div className="app">
      <Sidebar activeView={view} onNavigate={setView} onNewTask={() => openDrawer('create')} />

      <div className="contentColumn">
        <AppHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main className="main">
          {view === 'dashboard' && <Dashboard onGoToTasks={goToTasks} />}
          {view === 'tasks' && (
            <TasksView
              key={tasksFilter}
              initialFilter={tasksFilter}
              searchQuery={searchQuery}
              onOpenTask={openDrawer}
            />
          )}
          {view === 'archives' && <ArchivesView onOpenTask={openDrawer} />}
          {view === 'settings' && <SettingsView />}
        </main>
      </div>

      <BottomNav
        activeView={view}
        onNavigate={setView}
        onNewTask={() => openDrawer('create')}
      />

      <TaskDrawer
        open={drawer.open}
        mode={drawer.mode}
        task={drawer.task}
        defaultPriority={settings.defaultPriority}
        defaultDurationUnit={settings.defaultDurationUnit}
        onClose={closeDrawer}
        onSave={handleSave}
        onDelete={deleteTask}
        onPostpone={postponeToTomorrow}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <TasksProvider>
        <AppShell />
      </TasksProvider>
    </SettingsProvider>
  );
}
