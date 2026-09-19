import { useState, useEffect } from "react";

export default function Dashboard({ onLogout }) {
  // 1. The memory box for our database rows
  const [equipmentList, setEquipmentList] = useState([]);

  // 2. The useEffect hook (Runs exactly once when the component loads)
  useEffect(() => {
    fetchEquipment();
  }, []); // <-- The empty array means "Only run once!"

  // 3. The function to grab data from your Node.js backend
  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem("token"); // Grab the VIP badge

      const response = await fetch("http://localhost:3000/api/equipment", {
        headers: {
          "Authorization": `Bearer ${token}` // Show the badge to the bouncer
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEquipmentList(data); // Save the database rows into React's memory
      } else {
        console.error("Failed to load equipment");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Equipment Dashboard</h2>
        <button 
          onClick={onLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* 4. Loop through the equipmentList and draw a card for each one */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipmentList.length === 0 ? (
          <p className="text-slate-500">No equipment found. Add some!</p>
        ) : (
          equipmentList.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
              <p className="text-slate-600">{item.brand} {item.model}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded">
                {item.type}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}