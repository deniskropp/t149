import React, { useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { PLAYBOOK_DATA } from './constants';
import TaskDependencyGraph from './components/TaskDependencyGraph';
import ProtocolRenderer from './components/ProtocolRenderer';
import ExecutionPanel from './components/ExecutionPanel';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  CheckCircle2, 
  BrainCircuit, 
  ShieldCheck, 
  Zap,
  User,
  Quote
} from 'lucide-react';

// --- Page Components ---

const Dashboard = () => {
  const tasksByRole = PLAYBOOK_DATA.roles.map(role => ({
    name: role.title,
    count: PLAYBOOK_DATA.tasks.filter(t => t.role === role.title).length
  })).filter(d => d.count > 0);

  const totalTasks = PLAYBOOK_DATA.tasks.length;
  const completedTasks = 0; // Mock data, assumes 0 started for now based on prompt

  const COLORS = ['#0ea5e9', '#8b5cf6', '#f472b6', '#22c55e', '#eab308', '#f97316'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary-500/20 text-primary-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">System Goal</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {PLAYBOOK_DATA.high_level_goal}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Task Velocity</h3>
          </div>
          <div className="text-3xl font-bold text-slate-100">{totalTasks} <span className="text-sm font-normal text-slate-500">Tasks Queue</span></div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
             <div className="bg-emerald-500 h-full w-[5%]"></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Initial synthesis phase active</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Integrity Status</h3>
          </div>
           <div className="flex items-center gap-2 text-green-400 mt-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">All Systems Nominal</span>
           </div>
           <p className="text-xs text-slate-500 mt-2">Monitoring active via SystemMonitor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-200 font-semibold mb-6">Task Distribution by Role</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByRole}>
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <h3 className="text-slate-200 font-semibold mb-6">Execution Distribution</h3>
           <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByRole}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {tasksByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
         <h3 className="text-slate-200 font-semibold mb-4">Reasoning Engine</h3>
         <div className="p-4 bg-slate-950 rounded border border-slate-800 font-mono text-sm text-slate-400">
           <span className="text-primary-500">>></span> {PLAYBOOK_DATA.reasoning}
         </div>
      </div>
    </div>
  );
};

const RolesPage = () => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-100">Team & Personas</h2>
         <span className="text-slate-400 text-sm">{PLAYBOOK_DATA.team.prompts.length} Active Agents</span>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLAYBOOK_DATA.team.prompts.map((persona, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 flex flex-col">
               <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
                 <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{persona.role}</h3>
                      <p className="text-xs text-primary-400 font-mono mt-1">Agent: {persona.agent}</p>
                    </div>
                    <div className="p-2 bg-slate-800 rounded-full">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                 </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2 text-slate-500">
                      <Quote className="w-4 h-4 transform rotate-180 flex-shrink-0" />
                      <p className="text-sm text-slate-300 italic line-clamp-6">
                        {persona.system_prompt}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(persona.system_prompt)}
                    className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
                  >
                    View Full System Prompt
                  </button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

const TasksPage = () => {
  const [view, setView] = useState<'list' | 'graph'>('list');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Tasks Roadmap</h2>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${view === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            List
          </button>
          <button 
            onClick={() => setView('graph')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${view === 'graph' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Graph
          </button>
        </div>
      </div>

      {view === 'graph' ? (
        <TaskDependencyGraph tasks={PLAYBOOK_DATA.tasks} />
      ) : (
        <div className="space-y-4">
          {PLAYBOOK_DATA.tasks.map((task) => (
            <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center gap-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-4 min-w-[150px]">
                <span className="font-mono text-primary-400 font-bold bg-primary-500/10 px-2 py-1 rounded text-sm">{task.id}</span>
                <span className="text-xs text-slate-500 px-2 py-1 bg-slate-950 rounded border border-slate-800">{task.role}</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-200 text-sm">{task.description}</p>
              </div>
              {task.deps.length > 0 && (
                 <div className="flex flex-wrap gap-2 md:justify-end min-w-[120px]">
                   {task.deps.map(d => (
                     <span key={d} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        Pre: {d}
                     </span>
                   ))}
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProtocolsPage = () => {
  // Extract protocol keys excluding general metadata
  const protocolKeys = Object.keys(PLAYBOOK_DATA).filter(k => 
    k.includes('protocols') || k.includes('guidelines') || k.includes('operational') || k.includes('monitoring')
  );

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-100">System Protocols & Guidelines</h2>
       <div className="space-y-8">
          {protocolKeys.map((key) => (
            <ProtocolRenderer 
              key={key} 
              title={key} 
              data={PLAYBOOK_DATA[key]} 
            />
          ))}
       </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/execution" element={<ExecutionPanel />} />
          <Route path="/protocols" element={<ProtocolsPage />} />
        </Routes>
      </Layout>
    </MemoryRouter>
  );
};

export default App;
