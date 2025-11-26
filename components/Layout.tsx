import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Workflow, 
  BookOpen, 
  Terminal,
  Play
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/roles", icon: Users, label: "Team & Roles" },
    { to: "/tasks", icon: Workflow, label: "Tasks & Roadmap" },
    { to: "/execution", icon: Play, label: "Execution" },
    { to: "/protocols", icon: BookOpen, label: "Protocols" },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-slate-800 bg-slate-950/50">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Terminal className="w-6 h-6 text-primary-500" />
          <h1 className="font-bold text-lg tracking-wider text-slate-100">
            META-AI <span className="text-primary-500 text-xs block font-normal tracking-normal">ORCHESTRATOR</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5" 
                    : "hover:bg-slate-800/50 hover:text-slate-100 text-slate-400"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p>System Status: <span className="text-green-500">Online</span></p>
          <p>Version: 1.0.0-alpha</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
        <div className="absolute inset-0 bg-slate-950 opacity-90 -z-10"></div>
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
