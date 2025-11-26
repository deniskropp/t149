import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Clock, 
  Cpu,
  ArrowRight
} from 'lucide-react';
import { PLAYBOOK_DATA } from '../constants';
import { Task } from '../types';

interface TaskState extends Task {
  status: 'pending' | 'ready' | 'running' | 'completed';
  startTime?: number;
  endTime?: number;
}

const ExecutionPanel: React.FC = () => {
  const [tasks, setTasks] = useState<TaskState[]>(() =>
    PLAYBOOK_DATA.tasks.map(t => ({ ...t, status: 'pending' }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const prevTasksRef = useRef<TaskState[]>(tasks);

  // Scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Logging side effect based on state transitions
  useEffect(() => {
    const prevTasks = prevTasksRef.current;
    let newLogAdded = false;
    const newLogs: string[] = [];
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    tasks.forEach((task, i) => {
      const prev = prevTasks[i];
      if (prev.status !== 'running' && task.status === 'running') {
        newLogs.push(`[${timestamp}] [${task.agent}] EXECUTING ${task.id}: ${task.role} initiating sequence...`);
      }
      if (prev.status === 'running' && task.status === 'completed') {
         const duration = ((task.endTime || 0) - (task.startTime || 0)) / 1000;
        newLogs.push(`[${timestamp}] [${task.role}] COMPLETED ${task.id} in ${duration.toFixed(1)}s`);
      }
    });

    if (newLogs.length > 0) {
      setLogs(prev => [...prev, ...newLogs]);
    }
    prevTasksRef.current = tasks;

    // Calculate progress
    const completed = tasks.filter(t => t.status === 'completed').length;
    setProgress(Math.round((completed / tasks.length) * 100));
  }, [tasks]);

  // Execution Loop
  useEffect(() => {
    if (!isRunning) return;

    const tick = setInterval(() => {
      setTasks(currentTasks => {
        const now = Date.now();
        const nextTasks = [...currentTasks];
        let hasChanges = false;

        // 1. Check for ready tasks (dependencies met)
        nextTasks.forEach((task, index) => {
          if (task.status === 'pending') {
            const depsMet = task.deps.every(depId => 
              nextTasks.find(t => t.id === depId)?.status === 'completed'
            );
            if (depsMet) {
              nextTasks[index] = { ...task, status: 'ready' };
              hasChanges = true;
            }
          }
        });

        // 2. Manage running tasks (simulate work)
        nextTasks.forEach((task, index) => {
          if (task.status === 'running') {
            // Random duration between 1.5s and 4s
            if (now - (task.startTime || 0) > 2000) {
              nextTasks[index] = { ...task, status: 'completed', endTime: now };
              hasChanges = true;
            }
          }
        });

        // 3. Start new tasks from 'ready' pool
        // Limit concurrency to 2 for visualization clarity
        const activeCount = nextTasks.filter(t => t.status === 'running').length;
        if (activeCount < 2) {
          const readyTask = nextTasks.find(t => t.status === 'ready');
          if (readyTask) {
            const idx = nextTasks.findIndex(t => t.id === readyTask.id);
            nextTasks[idx] = { ...readyTask, status: 'running', startTime: now };
            hasChanges = true;
          }
        }

        // Auto-stop if all completed
        if (nextTasks.every(t => t.status === 'completed')) {
          setIsRunning(false);
        }

        return hasChanges ? nextTasks : currentTasks;
      });
    }, 800); // Tick rate

    return () => clearInterval(tick);
  }, [isRunning]);

  const toggleExecution = () => {
    if (tasks.every(t => t.status === 'completed')) {
      handleReset();
      setTimeout(() => setIsRunning(true), 100);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTasks(PLAYBOOK_DATA.tasks.map(t => ({ ...t, status: 'pending' })));
    setLogs([]);
    setProgress(0);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SYSTEM: Execution state reset.`]);
  };

  const getStatusIcon = (status: TaskState['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'running': return <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />;
      case 'ready': return <Circle className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />;
      default: return <Circle className="w-5 h-5 text-slate-700" />;
    }
  };

  const getStatusClass = (status: TaskState['status']) => {
    switch (status) {
      case 'completed': return 'border-emerald-500/30 bg-emerald-500/5';
      case 'running': return 'border-primary-500/50 bg-primary-500/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]';
      case 'ready': return 'border-indigo-500/30 bg-indigo-500/5';
      default: return 'border-slate-800 bg-slate-900/50 opacity-60';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-primary-500/20 rounded-lg text-primary-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Operational Cycle Execution</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Orchestrator Sequence</span>
              <span>•</span>
              <span className={isRunning ? "text-green-400 animate-pulse" : "text-slate-500"}>
                {isRunning ? "ACTIVE" : "IDLE"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex-1 md:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500 ease-out"
               style={{ width: `${progress}%` }}
             />
           </div>
           <span className="text-sm font-mono text-primary-400 w-12 text-right">{progress}%</span>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={toggleExecution}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              isRunning 
                ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20' 
                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
            }`}
          >
            {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start Execution</>}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left: Task List */}
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-inner">
          <div className="p-3 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between sticky top-0 backdrop-blur-sm z-10">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Task Queue</h3>
            <span className="text-xs text-slate-500 px-2">{tasks.filter(t => t.status === 'completed').length} / {tasks.length}</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStatusClass(task.status)}`}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-slate-400">{task.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      task.status === 'running' ? 'bg-primary-500/20 border-primary-500/30 text-primary-300' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>
                      {task.role}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${task.status === 'completed' ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-200'}`}>
                    {task.description}
                  </p>
                </div>
                {task.status === 'completed' && task.endTime && task.startTime && (
                   <div className="text-[10px] text-emerald-500/70 font-mono whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {((task.endTime - task.startTime) / 1000).toFixed(1)}s
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Terminal / Logs */}
        <div className="lg:w-1/3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-mono text-slate-400">System Logs</h3>
          </div>
          <div 
            ref={logContainerRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scroll-smooth"
          >
             {logs.length === 0 && (
               <div className="text-slate-600 italic">Waiting to start operational cycle...</div>
             )}
             {logs.map((log, i) => (
               <div key={i} className="break-words">
                 {log.includes('EXECUTING') ? (
                   <span className="text-primary-400">{log}</span>
                 ) : log.includes('COMPLETED') ? (
                   <span className="text-emerald-400">{log}</span>
                 ) : log.includes('SYSTEM') ? (
                   <span className="text-amber-400">{log}</span>
                 ) : (
                   <span className="text-slate-300">{log}</span>
                 )}
               </div>
             ))}
             {isRunning && (
               <div className="flex items-center gap-2 text-slate-500 mt-2 animate-pulse">
                 <span className="w-2 h-4 bg-slate-500 block"></span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;
