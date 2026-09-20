import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

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
        <div className="w-full min-h-screen bg-slate-100 flex py-10">
            <Dashboard 
              onLogout={() => {
                localStorage.removeItem("token");
                setCurrentScreen("login");
              }} 
            />
        </div>
      )}

    </div>
  );
}