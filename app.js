// 1. Grab the form element from the HTML
const form = document.getElementById('maintenanceForm');

// 2. Listen for the 'submit' event (when the "Add Entry" button is clicked)
form.addEventListener('submit', async function(event) {
    
    // 3. Stop the page from automatically refreshing
    event.preventDefault();

    // 4. Gather the values from the input fields using their IDs
    const dateValue = document.getElementById('date').value;
    const modelValue = document.getElementById('guitarModel').value;
    const typeValue = document.getElementById('maintenanceType').value;
    const notesValue = document.getElementById('notes').value;

    // 5. Package everything into a clean JavaScript object
    const newLog = {
        date: dateValue,
        model: modelValue,
        maintenanceType: typeValue,
        notes: notesValue
    };

    // 6. Print it to the console to prove you successfully captured the data!
    console.log("New Maintenance Log Captured:", newLog);


// 2. Wrap your network request in a try/catch block to handle errors gracefully
    try {
        const response = await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newLog) 
        });

        const data = await response.json();
        
        // 1. Grab the blank billboard from the HTML
        const messageBoard = document.getElementById('statusMessage');

        // 2. Paint the text green and inject our success message
        messageBoard.style.color = 'green';
        messageBoard.textContent = 'Maintenance log saved successfully!';

        // 3. Now that we know it succeeded, wipe the form clean for the next entry
        form.reset();

        setTimeout(function() {
            messageBoard.textContent = ''; 
        }, 3000);

    } catch (error) {
        // If the internet crashes, show a red error on the screen instead of the console
        const messageBoard = document.getElementById('statusMessage');
        messageBoard.style.color = 'red';
        messageBoard.textContent = 'Uh oh! Failed to save the log. Please try again.';

        setTimeout(function() {
            messageBoard.textContent = ''; 
        }, 3000);
    }
});