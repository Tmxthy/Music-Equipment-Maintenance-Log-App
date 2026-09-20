import { useState } from "react";

// 1. Catch the 'onSwitch' remote control in the parentheses
export default function Login({ onSwitch, onLoginSuccess }) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // THE LOGIN LOGIC
  const handleLogin = async (e) => {
    e.preventDefault(); // Stop the page from refreshing

    try {
      // 1. Send the data to your Node.js backend
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }) // Send our state variables!
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Success! Save the VIP badge into the browser's "wallet"
        localStorage.setItem("token", data.token);
        alert("Login successful! Check your console.");
        
        // Push the remote control button!
        onLoginSuccess();
        
        // (Later, we will tell App.jsx to change the screen here)
      } else {
        // 3. Failed! Show the error from the backend (e.g., "Invalid credentials")
        alert(data.error); 
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the server.");
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Login</h2>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
    
        {/*TASK A: Add an Email <input>*/} 
        {/*Give it these classes: "border border-slate-300 p-2 rounded-md focus:outline-none focus:border-emerald-500"*/} 
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="border border-slate-300 p-2 rounded-md focus:outline-none focus:border-emerald-500"
        />
        
        {/* TASK B: Add a Password <input>. 
            Use the exact same classes as the email input.*/} 
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="border border-slate-300 p-2 rounded-md focus:outline-none focus:border-emerald-500"
        />
            
        {/* TASK C: Add a <button>. 
            Give it these classes: "bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 font-semibold"*/} 
        <button className="bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 font-semibold">Login</button>
            
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        {/* 2. Attach the remote control to the button's onClick!*/}
        <button type="button" onClick={onSwitch} className="text-emerald-600 hover:underline">
          Register here
        </button>
      </p>
    </div>
  );
}


