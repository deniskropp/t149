import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Task } from '../types';

interface TaskDependencyGraphProps {
  tasks: Task[];
}

const TaskDependencyGraph: React.FC<TaskDependencyGraphProps> = ({ tasks }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !tasks.length) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 600;

    // Prepare nodes and links
    const nodes = tasks.map(t => ({ id: t.id, ...t }));
    const links: { source: string; target: string }[] = [];
    
    tasks.forEach(task => {
      task.deps.forEach(dep => {
        links.push({ source: dep, target: task.id });
      });
    });

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Arrow marker
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .join("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#64748b")
      .attr("d", "M0,-5L10,0L0,5");

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(40));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles
    node.append("circle")
      .attr("r", 20)
      .attr("fill", "#0f172a")
      .attr("stroke", "#0ea5e9")
      .attr("stroke-width", 2)
      .attr("class", "cursor-pointer transition-all duration-300 hover:fill-primary-500/20");

    // Node labels (ID)
    node.append("text")
      .text(d => d.id)
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#e2e8f0")
      .style("pointer-events", "none");
    
    // Tooltips (Simple title via title element for now)
    node.append("title")
      .text(d => `${d.id}: ${d.description}\nRole: ${d.role}`);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [tasks]);

  return (
    <div ref={containerRef} className="w-full h-[600px] border border-slate-800 rounded-xl bg-slate-900 overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold bg-slate-950/50 p-2 rounded backdrop-blur-md">Task Dependency Force Graph</h3>
      </div>
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default TaskDependencyGraph;