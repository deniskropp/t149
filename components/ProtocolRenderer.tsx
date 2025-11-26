import React from 'react';
import { ChevronRight, Circle } from 'lucide-react';

interface ProtocolRendererProps {
  data: any;
  title: string;
}

const renderValue = (key: string, value: any, depth: number = 0): React.ReactNode => {
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2 mt-2">
        {value.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
             <Circle className="w-1.5 h-1.5 mt-2 flex-shrink-0 text-primary-500 fill-current" />
             <span className="leading-relaxed">{typeof item === 'object' ? renderValue(String(idx), item, depth + 1) : item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className={`space-y-3 ${depth > 0 ? 'mt-2 pl-4 border-l border-slate-800' : ''}`}>
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
             <h4 className="text-primary-400 font-mono text-sm mb-1 uppercase tracking-wide opacity-80">{k.replace(/_/g, ' ')}</h4>
             <div className="text-slate-300">
                {renderValue(k, v, depth + 1)}
             </div>
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{String(value)}</p>;
};

const ProtocolRenderer: React.FC<ProtocolRendererProps> = ({ data, title }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-slate-700">
      <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-primary-500" />
          {title.replace(/_/g, ' ')}
        </h2>
      </div>
      <div className="p-6">
        {renderValue('root', data)}
      </div>
    </div>
  );
};

export default ProtocolRenderer;