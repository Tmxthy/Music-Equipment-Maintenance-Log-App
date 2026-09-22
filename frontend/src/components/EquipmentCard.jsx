const EquipmentCard = ({ item, onEdit, onDelete }) => {
  // We will pull these from the database later. For now, we simulate them.
  const status = item.condition || 'Gig Ready'; 
  const isNeedsMaintenance = status === 'Needs Maintenance';
  
  // Dynamic color for the status badge (Green for good, Amber/Red for bad)
  const badgeColor = isNeedsMaintenance 
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-500 transition-colors duration-200">
      
      {/* Top Section: Header & Badge */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100 tracking-tight">{item.name}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">
              {item.brand} <span className="text-slate-600 mx-1">•</span> {item.type}
            </p>
          </div>
          {/* Status Badge */}
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeColor}`}>
            {status}
          </span>
        </div>
        
        {/* Middle Section: Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6 mt-6 p-4 bg-slate-900/50 rounded-lg">
           <div>
             <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Serial No.</p>
             <p className="text-sm text-slate-300 font-mono">{item.serial_number || 'UNKNOWN'}</p>
           </div>
           <div>
             <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Last Serviced</p>
             <p className="text-sm text-slate-300">{item.last_serviced || 'N/A'}</p>
           </div>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-slate-700/70">
        <button 
          onClick={() => onEdit(item)} 
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Edit Details
        </button>
        <button 
          onClick={() => onDelete(item.id)} 
          className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Delete
        </button>
      </div>
      
    </div>
  );
};

export default EquipmentCard;