import React, { useState, useEffect } from 'react';

const MaintenanceLog = ({ equipment, existingLog, onClose }) => {
  const [formData, setFormData] = useState({
    service_date: '', 
    description: '', 
    cost: '', 
    performed_by: '',
    status: 'Completed' // Default to completed
  });

  // Pre-fill the form if we are editing an existing log
  useEffect(() => {
    if (existingLog) {
      // HTML date inputs require the YYYY-MM-DD format
      const formattedDate = new Date(existingLog.service_date).toISOString().split('T')[0];
      
      setFormData({
        service_date: formattedDate,
        description: existingLog.description,
        cost: existingLog.cost || '',
        performed_by: existingLog.performed_by || '',
        status: existingLog.status || 'Completed'
      });
    }
  }, [existingLog]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // If existingLog exists, we PUT (update). Otherwise, we POST (create).
    const method = existingLog ? 'PUT' : 'POST';
    const url = existingLog 
      ? `http://localhost:3000/api/equipment/${equipment.id}/maintenance/${existingLog.id}`
      : `http://localhost:3000/api/equipment/${equipment.id}/maintenance`;

    try {
      await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      onClose(); // Close the modal and trigger the parent refresh
    } catch (err) {
      console.error("Failed to save log");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900">
          <h2 className="text-xl font-bold text-slate-100">
            {existingLog ? 'Edit Log: ' : 'New Log: '} 
            <span className="text-emerald-400">{equipment.brand}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-400 font-bold text-xl transition">&times;</button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Date</label>
                <input type="date" name="service_date" value={formData.service_date} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded focus:border-emerald-500 outline-none" required />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded focus:border-emerald-500 outline-none">
                  <option value="Completed">Completed</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="e.g. Fret dress, new strings" className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded h-20 resize-none focus:border-emerald-500 outline-none" required></textarea>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Cost (RM)</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} placeholder="0.00" className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded focus:border-emerald-500 outline-none" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Performed By</label>
                <input type="text" name="performed_by" value={formData.performed_by} onChange={handleChange} placeholder="e.g. Guitar Center" className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded focus:border-emerald-500 outline-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button type="button" onClick={onClose} className="flex-1 bg-slate-700 text-slate-200 font-bold py-2 rounded hover:bg-slate-600 transition">Cancel</button>
              <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-500 transition shadow-md">
                {existingLog ? 'Save Changes' : 'Add Record'}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
};

export default MaintenanceLog;