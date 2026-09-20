import { useState } from "react";

export default function Register({onSwitch}) {
  // NEW: Memory boxes for what the user is typing
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // THE REGISTER LOGIC
  const handleRegister = async (e) => {
    e.preventDefault(); // Stop the page from refreshing

    try {
      // 1. Send the data to your Node.js backend
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }) // Send our state variables!
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now log in.");

        onSwitch(); // Switch to the login screen after successful registration
        
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
    // This is the white card. 
    // p-8 means "padding", rounded-lg means "rounded corners", shadow-md gives it a nice drop shadow.
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create Account</h2>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        

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
        <button className="bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 font-semibold">Create Account</button>
            

      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
         <button type="button" onClick={onSwitch} className="text-emerald-600 hover:underline">
          Login here
        </button>
      </p>

    </div>
  );
}