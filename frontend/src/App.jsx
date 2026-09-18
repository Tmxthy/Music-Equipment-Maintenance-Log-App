import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  // THIS IS THE BRAIN OF YOUR APP
  // currentScreen: The memory variable (starts as 'login')
  // setCurrentScreen: The function we use to change the memory
  const [currentScreen, setCurrentScreen] = useState("login");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      
      {currentScreen === "login" && (
        <Login 
          onSwitch={() => setCurrentScreen("register")} 
          onLoginSuccess={() => setCurrentScreen("dashboard")} // Catch the success signal!
        />
      )}

      {currentScreen === "register" && (
        <Register 
          onSwitch={() => setCurrentScreen("login")} 
        />
      )}

      {currentScreen === "dashboard" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Welcome to the VIP Room!</h1>
          <p className="text-slate-600 mt-2">Your equipment dashboard will go here.</p>
          
          <button 
            onClick={() => {
              localStorage.removeItem("token"); // Rip up the VIP badge
              setCurrentScreen("login"); // Kick them back to the login screen
            }}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

    </div>
  );
}