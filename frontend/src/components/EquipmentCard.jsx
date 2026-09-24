import React, { useState, useEffect } from 'react';
import MaintenanceLog from '../pages/MaintenanceLog';

const EquipmentCard = ({item, onEdit, onDelete }) => {
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/equipment/${item.id}/maintenance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [item.id]);

  const handleDeleteLog = async (logId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this log?");
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/api/equipment/${item.id}/maintenance/${logId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchLogs();
    } catch (err) {
      console.error("Failed to delete log");
    }
  };

  const handleAddClick = () => {
    setEditingLog(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (log) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  // Get today's date once for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col gap-4 shadow-lg">
      
      {/* Top: Equipment Info */}
      <div className="border-b border-slate-700 pb-3 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-100">{item.brand} {item.model}</h2>
          <p className="text-slate-400 capitalize">{item.type} • {item.condition}</p>
        </div>
      </div>

      {/* Middle: Maintenance History List */}
      <div className="flex-1 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Maintenance Log</h3>
        
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No maintenance records yet.</p>
        ) : (
          <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
            {logs.map(log => {
              // --- PER-LOG RED HIGHLIGHT LOGIC ---
              const serviceDate = new Date(log.service_date);
              serviceDate.setHours(0, 0, 0, 0);
              
              const isLogOverdue = log.status === 'Scheduled' && serviceDate < today;
              
              // Change the box styling if overdue
              const boxClass = isLogOverdue 
                ? "bg-rose-950/30 p-3 rounded border border-rose-500 flex flex-col gap-2" 
                : "bg-slate-800 p-3 rounded border border-slate-600 flex flex-col gap-2";

              // Change the pill styling if overdue
              const badgeClass = log.status === 'Scheduled'
                ? isLogOverdue 
                  ? "bg-rose-500/20 text-rose-400 animate-pulse" // Overdue!
                  : "bg-amber-500/20 text-amber-400"             // Upcoming
                : "bg-emerald-500/20 text-emerald-400";          // Completed

              return (
                <li key={log.id} className={boxClass}>
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-slate-200">
                      {isLogOverdue && <span className="mr-2">⚠️</span>}
                      {log.description}
                    </p>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${badgeClass}`}>
                      {isLogOverdue ? 'Overdue' : (log.status || 'Completed')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-xs ${isLogOverdue ? 'text-rose-400/80 font-bold' : 'text-slate-400'}`}>
                      {isLogOverdue ? 'Due: ' : ''}{new Date(log.service_date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => handleEditClick(log)} className="text-blue-400 text-xs hover:text-blue-300 transition">Edit</button>
                      <button onClick={() => handleDeleteLog(log.id)} className="text-rose-400 text-xs hover:text-rose-300 transition">Delete</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Bottom: Add Button */}
      <button 
        onClick={handleAddClick}
        className="w-full bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-500 transition shadow-md"
      >
        Add Maintenance Log
      </button>

      <button 
        onClick={() => onEdit(item)}
        className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded hover:bg-slate-600 transition shadow-md"
      >
        Edit
      </button>

      <button 
        onClick={() => onDelete(item.id)}
        className="flex-1 bg-rose-600/80 text-white font-bold py-2 rounded hover:bg-rose-600 transition shadow-md"
      >
        Delete
      </button>

      {/* The Pop-Up Modal */}
      {isModalOpen && (
        <MaintenanceLog 
          equipment={item} 
          existingLog={editingLog} 
          onClose={() => {
            setIsModalOpen(false);
            fetchLogs(); 
          }} 
        />
      )}
    </div>
  );
};

export default EquipmentCard;