function showStatusMessage(text, color) {
        const messageBoard = document.getElementById('statusMessage');
        messageBoard.style.color = color;
        messageBoard.textContent = text;

        setTimeout(function() {
            messageBoard.textContent = ''; 
        }, 3000);
}   

// ==========================================
// 1. UI SETUP & TOGGLING
// ==========================================
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');
const authMessage = document.getElementById('auth-message');

// Switch to Register Form
document.getElementById('show-register').addEventListener('click', (e) => {
  e.preventDefault(); // Stops the page from jumping
  loginBox.style.display = 'none';
  registerBox.style.display = 'block';
  authMessage.textContent = ''; // Clear old errors
});

// Switch to Login Form
document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  registerBox.style.display = 'none';
  loginBox.style.display = 'block';
  authMessage.textContent = '';
});

document.getElementById('logout-btn').addEventListener('click', handleLogout);

// ==========================================
// 2. LOGIN BUTTON LOGIC
// ==========================================
document.getElementById('login-btn').addEventListener('click', async () => {
  // Grab what the user typed
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // If the Bouncer (backend) rejects the login, show the error on the screen
    if (!response.ok) {
      authMessage.textContent = data.error;
      return; 
    }

    // SUCCESS!
    // 1. Save the VIP badge into the browser's pocket
    localStorage.setItem('token', data.token);
    
    // 2. Hide the login screen, show the app screen
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    authMessage.textContent = '';

    console.log("Logged in successfully! Token saved.");
    
    // 3. Now that we are in, tell the app to fetch the equipment!
    loadEquipment(); 

  } catch (err) {
    authMessage.textContent = "Could not connect to server.";
  }
});

const form = document.getElementById('equipmentForm');

// NEW: Global memory variables
let inventoryData = []; // This will hold a copy of our database array
let editingId = null;   // This will remember WHICH item we are editing (null means we are in Create Mode)

form.addEventListener('submit', async function(event) {
    
    // 3. Stop the page from automatically refreshing
    event.preventDefault();

    // 4. Gather the values from the input fields using their IDs
    const nameValue = document.getElementById('equipmentName').value;
    const typeValue = document.getElementById('equipmentType').value;
    const brandValue = document.getElementById('equipmentBrand').value;
    const modelValue = document.getElementById('equipmentModel').value;
    const serial_NumberValue = document.getElementById('serial_Number').value;
    const purchasePriceValue = document.getElementById('purchasePrice').value;
    const purchaseDateValue = document.getElementById('purchaseDate').value;
    const conditionValue = document.getElementById('condition').value;
    const notesValue = document.getElementById('notes').value;

    // 5. Package everything into a clean JavaScript object
    const formData = {
        name: nameValue,
        type: typeValue,
        brand: brandValue,
        model: modelValue,
        serialNumber: serial_NumberValue,
        purchasePrice: purchasePriceValue,
        purchaseDate: purchaseDateValue,
        condition: conditionValue,
        notes: notesValue
    };


// 2. Wrap your network request in a try/catch block to handle errors gracefully
    try {
        // 2. THE TRAFFIC COP: Decide the Method and the URL
        let url = 'http://localhost:3000/api/equipment';
        let httpMethod = 'POST'; // Default to Create Mode

        // If the sticky note has a number, switch to Edit Mode!
        if (editingId !== null) {
            url = `http://localhost:3000/api/equipment/${editingId}`;
            httpMethod = 'PUT'; 
        }

        // 3. Send the network request using the variables we just set
        const token = localStorage.getItem('token');
        
        const response = await fetch(url, {
            method: httpMethod,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${'token'}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showStatusMessage(editingId ? 'Equipment updated!' : 'Equipment added!', 'green');
            
            // 4. CLEANUP: Reset everything back to normal Create Mode
            form.reset();
            editingId = null; // Erase the sticky note!
            
            // Change the button back to blue "Add Entry"
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = "Add Entry";
            submitButton.style.backgroundColor = "#007BFF"; 

            // Refresh the cards on the screen
            loadEquipment();
        }
    } catch (error) {
        console.error('Error saving equipment:', error);
        showStatusMessage('Failed to save equipment', 'red');
    }

    loadEquipment(); // Call the function to fetch and log the equipment data after submission
});

async function loadEquipment() {
    try {
        // 1. Reach into the browser's pocket and grab the saved token
        const token = localStorage.getItem('token');
        
        // 2. Fetch the data (No options object needed for a simple GET!)
        const response = await fetch('http://localhost:3000/api/equipment', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // 3. Check if the Bouncer kicked us out
        if (!response.ok) {
            throw new Error("Not authorized. Please log in.");
        }
        
        // 3. Unpack the JSON
        const data = await response.json();

        // NEW: Save a copy of the data to our global memory so the Edit button can find it!
        inventoryData = data;

        const container = document.getElementById('equipmentList');
        container.innerHTML = '';

        data.forEach(function(item) {
            const equipmentCard = `
                <div style="border: 1px solid #ccc; margin-bottom: 10px; padding: 15px; border-radius: 5px;">
                    <h3 style="margin-top: 0;">${item.brand} ${item.model}</h3>
                    <p><strong>Name:</strong> ${item.name}</p>
                    <p><strong>Type:</strong> ${item.type}</p>
                    <p><strong>Condition:</strong> ${item.condition}</p>
                    <p><strong>Price:</strong> RM ${item.purchase_price}</p>
                    
                    <button onclick="fillEditForm(${item.id})" style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer; margin-right: 5px;">Edit</button>
                    
                    <button onclick="deleteItem(${item.id})" style="background-color: #ff4444; color: white; border: none; padding: 5px 10px; cursor: pointer;">Delete</button>
                </div>
            `;
            container.innerHTML += equipmentCard;
        });

    } catch (error) {
        console.error('Error fetching equipment:', error);
    }
}

// ==========================================
// 4. DELETE LOGIC
// ==========================================

async function deleteItem(id) {
    // 1. Add a safety check so users don't delete things by accident
    const isConfirmed = confirm("Are you sure you want to delete this equipment?");
    if (!isConfirmed) {
        return; // Stop the function immediately if they click "Cancel"
    }

    const token = localStorage.getItem('token');

    try {
        // 2. Send the DELETE request to the server, targeting the specific ID in the URL
        const response = await fetch(`http://localhost:3000/api/equipment/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // 3. If the server says it was successful, refresh the screen
        if (response.ok) {
            showStatusMessage('Equipment deleted successfully!', 'green');
            loadEquipment(); // This instantly erases the card from the screen!
        }

    } catch (error) {
        console.error('Error deleting item:', error);
        showStatusMessage('Failed to delete item.', 'red');
    }
}

// ==========================================
// 5. EDIT LOGIC (Refilling the form)
// ==========================================

function fillEditForm(id) {
    // 1. Search our memory array to find the exact item we clicked
    const itemToEdit = inventoryData.find(item => item.id === id);

    // 2. Put the app into "Edit Mode" by remembering the ID
    editingId = id; 

    // 3. Inject the data back into the HTML input fields
    document.getElementById('equipmentName').value = itemToEdit.name;
    document.getElementById('equipmentType').value = itemToEdit.type;
    document.getElementById('equipmentBrand').value = itemToEdit.brand;
    document.getElementById('equipmentModel').value = itemToEdit.model;
    document.getElementById('serial_Number').value = itemToEdit.serial_number;
    
    // We need to cut off the time data from the date string so it fits in the HTML input
    document.getElementById('purchaseDate').value = itemToEdit.purchase_date.split('T')[0]; 
    document.getElementById('purchasePrice').value = itemToEdit.purchase_price;
    document.getElementById('condition').value = itemToEdit.condition;
    document.getElementById('notes').value = itemToEdit.notes;

    // 4. Change the submit button so the user knows they are editing, not adding
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = "Save Changes";
    submitButton.style.backgroundColor = "#ff9800"; // Make it orange for Edit Mode

    // 5. Scroll the user smoothly back to the top of the page to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add this to your app.js
function checkLoginStatus() {
  const token = localStorage.getItem('token');

  if (token) {
    // If they HAVE a badge: Hide login, show the app!
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    
    // Automatically load the data since we know they are logged in
    loadEquipment(); 
  } else {
    // If they DON'T have a badge: Show login, hide the app!
    authSection.style.display = 'block';
    appSection.style.display = 'none';
  }
}

async function handleRegister(event) {
  // 1. Stop the page from reloading
  event.preventDefault();

  // 2. Grab the inputs (make sure these IDs match your HTML!)
  const emailValue = document.getElementById('register-email').value;
  const passwordValue = document.getElementById('register-password').value;

  const newUser = {
    email: emailValue,
    password: passwordValue
  };

  try {
    // 3. Send the data to the Ticket Booth (Backend) to create the account
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    if (response.ok) {
      // 4. Success! Tell the user, then teleport them to the Login screen
      console.log("Account created:", data);
      alert("Account created successfully! Please log in.");
      
      // Use the toggle function you fixed earlier!
      showLogin(); 
    } else {
      alert("Registration failed: " + data.error);
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}


function handleLogout() {
  // 1. Throw the badge in the trash
  localStorage.removeItem('token');
  
  // 2. Clear the equipment list from the screen (so the next person can't see it)
  document.getElementById('equipmentList').innerHTML = '';
  
  // 3. Give the user some feedback
  console.log("Logged out successfully!");
  alert("You have been logged out.");
  
  checkLoginStatus(); // This will hide the app and show the login screen
}

loadEquipment();