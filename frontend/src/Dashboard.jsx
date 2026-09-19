import { useState, useEffect } from "react";

export default function Dashboard({ onLogout }) {
  // 1. The memory for the database rows
  const [equipmentList, setEquipmentList] = useState([]);

  // 2. NEW: The memory for the new form! Starts empty.
  const [formData, setFormData] = useState({
    name: "", type: "", brand: "", model: "", 
    serial_number: "", purchase_date: "", purchase_price: "", condition: "", notes: ""
  });

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

  // 4. NEW: The function to send the new item to the backend
  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/equipment", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData) // Send the whole form object
      });

      if (response.ok) {
        // Clear the form back to empty
        setFormData({
          name: "", type: "", brand: "", model: "", 
          serial_number: "", purchase_date: "", purchase_price: "", condition: "", notes: ""
        });
        // Refresh the list to show the new item!
        fetchEquipment(); 
      } else {
        alert("Failed to add equipment");
      }
    } catch (error) {
      console.error("Error adding equipment:", error);
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
          <h3 className="text-xl font-bold mb-4 text-slate-800">Add New Equipment</h3>
          
          <form onSubmit={handleAddEquipment} className="flex flex-col gap-3">
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
              Add Equipment
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: The Equipment Cards */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 h-min">
          {equipmentList.length === 0 ? (
            <p className="text-slate-500">No equipment found. Add some!</p>
          ) : (
            equipmentList.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                <p className="text-slate-600">{item.brand} {item.model}</p>
                <div className="mt-2 text-sm text-slate-500">
                  <p>Type: {item.type}</p>
                  <p>Price: RM {item.purchase_price}</p>
                  <p>Condition: {item.condition}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}