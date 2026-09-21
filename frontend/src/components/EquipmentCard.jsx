const EquipmentCard = ({ item, onEdit, onDelete }) => {
  return (
    // Start directly with the div container, NO equipmentList.map here!
    <div className="bg-white p-4 rounded shadow border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
      <p className="text-sm text-slate-600">Brand: {item.brand}</p>
      <p className="text-sm text-slate-600">Type: {item.type}</p>
      
      {/* Make sure your buttons use the passed-in props exactly like this: */}
      <div className="mt-4 space-x-2">
        <button 
          onClick={() => onEdit(item)} 
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(item.id)} 
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;