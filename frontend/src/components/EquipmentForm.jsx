const EquipmentForm = ({ formData, handleChange, handleSubmit, editingId }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-slate-200 w-full lg:w-1/3 h-fit">
        <h3 className="text-xl font-bold mb-4 text-slate-800">{editingId ? "Edit Equipment" : "Add New Equipment"}</h3>
          
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Item Name (e.g. Stratocaster)" className="border p-2 rounded" required />
            <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Type (e.g. Guitar)" className="border p-2 rounded" required />
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="border p-2 rounded" />
            <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model" className="border p-2 rounded" />
            <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} placeholder="Serial Number" className="border p-2 rounded" />
            <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} className="border p-2 rounded" />
            <input type="number" name="purchase_price" value={formData.purchase_price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" />
            
            <select name="condition" value={formData.condition} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select Condition...</option>
              <option value="New">New</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
            
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes..." className="border p-2 rounded"></textarea>
            
            <button type="submit" className="bg-emerald-600 text-white py-2 rounded mt-2 hover:bg-emerald-700 font-bold">
              {editingId ? "Update Equipment" : "Add Equipment"}
            </button>
          </form>
        </div>  
    );
};

export default EquipmentForm;