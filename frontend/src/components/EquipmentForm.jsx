const EquipmentForm = ({ formData, handleChange, handleSubmit, editingId }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-full lg:w-1/3 h-fit">
        <h3 className="text-xl font-bold mb-6 text-slate-100 tracking-tight">
          {editingId ? "Edit Equipment Specs" : "Add New Gear"}
        </h3>
          
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Item Name (e.g. Stratocaster)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" required />
            
            <div className="flex gap-4">
              <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Type (e.g. Guitar)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 w-1/2" required />
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 w-1/2" />
            </div>

            <div className="flex gap-4">
              <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model" className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 w-1/2" />
              <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} placeholder="Serial Number" className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm w-1/2" />
            </div>

            <div className="flex gap-4">
              <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} className="bg-slate-900 border border-slate-700 text-slate-400 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 w-1/2" />
              <input type="number" name="purchase_price" value={formData.purchase_price} onChange={handleChange} placeholder="Price (RM)" className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 w-1/2" />
            </div>
            
            <select name="condition" value={formData.condition} onChange={handleChange} className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 appearance-none">
              <option value="" className="text-slate-500">Select Status...</option>
              <option value="New">New</option>
              <option value="Gig Ready">Gig Ready</option>
              <option value="Needs Maintenance">Needs Maintenance</option>
              <option value="In The Shop">In The Shop</option>
            </select>
            
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Maintenance notes or specs..." className="bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 h-24 resize-none"></textarea>
            
            <button type="submit" className="bg-emerald-600/90 text-emerald-50 py-3 rounded-lg mt-2 hover:bg-emerald-500 font-bold transition-colors shadow-lg shadow-emerald-900/20">
              {editingId ? "Update Specs" : "Add to Inventory"}
            </button>
          </form>
        </div>  
    );
};

export default EquipmentForm;