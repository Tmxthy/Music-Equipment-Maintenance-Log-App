const EquipmentCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 h-min">
          {equipmentList.length === 0 ? (
            <p className="text-slate-500">No equipment found. Add some!</p>
          ) : (
            equipmentList.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                  <p className="text-slate-600">{item.brand} {item.model}</p>
                  <div className="mt-2 text-sm text-slate-500">
                    <p>Type: {item.type}</p>
                    <p>Price: RM {item.purchase_price}</p>
                    <p>Condition: {item.condition}</p>
                  </div>
                </div>
                
                {/* The Button Container */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
                  
                  {/* NEW: The Edit Button */}
                  <button 
                    onClick={() => handleEditClick(item)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
                
              </div>
            ))
          )}
        </div>
  );
};

export default EquipmentCard;