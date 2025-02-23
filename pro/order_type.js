const dineInButton = document.getElementById('dineIn');
const takeAwayButton = document.getElementById('takeAway');
const tableSelection = document.getElementById('tableSelection');

// Fetch available tables from the backend
async function fetchAvailableTables() {
    try {
        const response = await fetch('/api/tables'); // Node.js backend endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch table data from the server');
        }
        const data = await response.json();
        return data.availableTables; // Returns an array of available table numbers
    } catch (error) {
        console.error('Error fetching available tables:', error);
        alert('Unable to load table data. Please try again later.');
        return [];
    }
}

// Reserve a table by sending a request to the backend
async function reserveTable(tableNumber) {
    try {
        const response = await fetch('/api/tables/select', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ table: tableNumber }), // Send the selected table number
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reserve the table');
        }

        const result = await response.json();
        const userConfirmed = confirm(result.message + '\nClick "OK" to proceed to payment.');
        if (userConfirmed) {
            // Redirect to payment.html
            window.location.href = 'payment.html';
        }
    } catch (error) {
        console.error('Error reserving the table:', error);
        alert(error.message || 'An error occurred. Please try again.');
    }
}

// Render table buttons dynamically
async function renderTableSelection() {
    tableSelection.style.display = 'grid';
    tableSelection.innerHTML = ''; // Clear previous content

    const availableTables = await fetchAvailableTables(); // Fetch tables from backend

    for (let i = 1; i <= 10; i++) {
        const tableButton = document.createElement('button');
        tableButton.textContent = `Table ${i}`;
        tableButton.disabled = !availableTables.includes(i); // Disable if table is reserved

        // Add click event listener for table selection
        tableButton.addEventListener('click', () => {
            reserveTable(i);
        });

        tableSelection.appendChild(tableButton); // Append the button to the grid
    }
}

// Event listeners for order type selection
dineInButton.addEventListener('click', renderTableSelection);

takeAwayButton.addEventListener('click', () => {
    tableSelection.style.display = 'none';
    const userConfirmed = confirm('You have selected Takeaway.\nClick "OK" to proceed to payment.');
    if (userConfirmed) {
        // Redirect to payment.html
        window.location.href = 'payment.html';
    }
});
