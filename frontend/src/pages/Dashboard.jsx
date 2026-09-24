import EquipmentCard from '../components/EquipmentCard';
import EquipmentForm from '../components/EquipmentForm';
import MaintenanceLog from '../pages/MaintenanceLog';
import { useState, useEffect } from "react";

export default function Dashboard({ onLogout }) {
  // 1. The memory for the database rows
  const [equipmentList, setEquipmentList] = useState([]);

  const [maintenanceItem, setMaintenanceItem] = useState(null);

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
    <div className="w-full min-h-screen bg-slate-900 text-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Equipment Dashboard</h2>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: The Form */}
        <EquipmentForm 
          formData={formData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          editingId={editingId} 
        />

        {/* RIGHT SIDE: The Equipment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentList.map(item => (
            <EquipmentCard 
              key={item.id} //key is a reserved, secret word that belongs exclusively to React's internal brain.
              item={item} 
              onEdit={handleEditClick} 
              onDelete={handleDelete}
            />
          ))}
        </div>

      </div>

    </div>
  );
}