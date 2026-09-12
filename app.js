const form = document.getElementById('equipmentForm');

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
    const newEquipment = {
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

function showStatusMessage(text, color) {
    const messageBoard = document.getElementById('statusMessage');
    messageBoard.style.color = color;
    messageBoard.textContent = text;

    setTimeout(function() {
        messageBoard.textContent = ''; 
    }, 3000);
}

// 2. Wrap your network request in a try/catch block to handle errors gracefully
    try {
        const response = await fetch('http://localhost:3000/api/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newEquipment) 
        });

        const data = await response.json();
        console.log('Server response:', data);
        
        showStatusMessage('Equipment saved successfully!', 'green');

        // 3. Now that we know it succeeded, wipe the form clean for the next entry
        form.reset();

    } catch (error) {
        // If the internet crashes, show a red error on the screen instead of the console
        showStatusMessage('Uh oh! Failed to save the log. Please try again.', 'red');

    }
    
    loadEquipment(); // Call the function to fetch and log the equipment data after submission
});

async function loadEquipment() {
    try {
        // 2. Fetch the data (No options object needed for a simple GET!)
        const response = await fetch('http://localhost:3000/api/equipment');
        
        // 3. Unpack the JSON
        const data = await response.json();
        
        // 4. Print the entire database inventory to the console
        console.log('Fetched equipment:', data);

    } catch (error) {
        console.error('Error fetching equipment:', error);
    }
}

loadEquipment();