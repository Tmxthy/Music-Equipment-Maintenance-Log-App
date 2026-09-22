import React, { useState, useEffect } from 'react';

const MaintenanceLog = ({ equipment, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    service_date: '', description: '', cost: '', performed_by: ''
  });

  // 1. Fetch logs when the window opens
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/equipment/${equipment.id}/maintenance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  // 2. Handle form typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit a new log to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/api/equipment/${equipment.id}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      setFormData({ service_date: '', description: '', cost: '', performed_by: '' }); // Clear form
      fetchLogs(); // Refresh the list!
    } catch (err) {
      console.error("Failed to save log");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
          <h2 className="text-xl font-bold text-slate-100">
            Maintenance Log: <span className="text-emerald-400">{equipment.brand} {equipment.model}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-400 font-bold text-xl">&times;</button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto flex flex-col md:flex-row gap-8">
          {/* Add New Log Form */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Add Service Record</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
              <input type="date" name="service_date" value={formData.service_date} onChange={handleChange} className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded focus:border-emerald-500 outline-none" required />
              <input type="text" name="performed_by" value={formData.performed_by} onChange={handleChange} placeholder="Performed By (e.g. Guitar Center)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded focus:border-emerald-500 outline-none" />
              <input type="number" name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost (RM)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded focus:border-emerald-500 outline-none" />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What was done? (e.g. Fret dress, new strings)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded h-24 resize-none focus:border-emerald-500 outline-none" required></textarea>
              <button type="submit" className="bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-500 transition">Save Record</button>
            </form>
          </div>

          {/* History List */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Service History</h3>
            <div className="flex flex-col gap-3 mt-2">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">No maintenance history yet.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="bg-slate-900 p-3 rounded border border-slate-700">
                    <div className="flex justify-between text-sm text-slate-400 mb-1">
                      <span>{new Date(log.service_date).toLocaleDateString()}</span>
                      <span className="text-emerald-400 font-mono">RM {log.cost || "0.00"}</span>
                    </div>
                    <p className="text-slate-200 font-medium">{log.description}</p>
                    {log.performed_by && <p className="text-xs text-slate-500 mt-2">By: {log.performed_by}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MaintenanceLog;