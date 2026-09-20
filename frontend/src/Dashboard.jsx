import { useState, useEffect } from "react";

export default function Dashboard({ onLogout }) {
  // 1. The memory for the database rows
  const [equipmentList, setEquipmentList] = useState([]);

  // 2. NEW: The memory for the new form! Starts empty.
  const [formData, setFormData] = useState({
    name: "", type: "", brand: "", model: "", 
    serial_number: "", purchase_date: "", purchase_price: "", condition: "", notes: ""
  });

  // NEW: The Traffic Cop
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/equipment", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEquipmentList(data);
      }
    } catch (error) {
      const errorData = await response.json();
      console.error("Backend rejected the request. Reason:", errorData);
    }
  };

  // 3. NEW: The smart function that updates the specific field you are typing in
  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep all the other fields exactly the same...
      [e.target.name]: e.target.value // ...but update the one they just typed in!
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // 1. Check the traffic cop. Are we updating or creating?
      const isUpdating = editingId !== null;
      
      // 2. Set the correct URL and Method based on the mode
      const url = isUpdating 
        ? `http://localhost:3000/api/equipment/${editingId}` 
        : `http://localhost:3000/api/equipment`;
        
      const method = isUpdating ? "PUT" : "POST";

      // 3. Send the request
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 4. Refresh the cards
        fetchEquipment();
        
        // 5. Reset the form back to blank and turn off Edit Mode
        setFormData({
          name: "", type: "", brand: "", model: "", serial_number: "",
          purchase_date: "", purchase_price: "", condition: "", notes: ""
        });
        setEditingId(null);
      } else {
        alert(isUpdating ? "Failed to update equipment" : "Failed to add equipment");
      }
    } catch (error) {
      console.error("Error saving equipment:", error);
    }
  };

  const handleEditClick = (item) => {
    // 1. Fill the form with the item's data
    setFormData(item);
    
    // 2. Tell the traffic cop we are in "Update" mode for this specific ID
    setEditingId(item.id);
    
    // Optional: Scroll to the top so the user sees the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (targetId) => {
    // 1. Add a safety check so users don't accidentally delete things
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;

    try {
      const token = localStorage.getItem("token");
      
      // 2. Target the specific ID in the URL
      const response = await fetch(`http://localhost:3000/api/equipment/${targetId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });

      if (response.ok) {
        // 3. If successful, refresh the cards on the screen
        fetchEquipment();
      } else {
        alert("Failed to delete equipment");
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Equipment Dashboard</h2>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: The Form */}
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

        {/* RIGHT SIDE: The Equipment Cards */}
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

      </div>
    </div>
  );
}