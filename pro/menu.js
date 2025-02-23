let totalAmount = 0;
let menuData = []; // Store all menu items

// Fetch menu items from the backend
function fetchMenu() {
    fetch('http://localhost:3000/api/menu')
        .then(response => response.json())
        .then(menuItems => {
            menuData = menuItems; // Store fetched items
            renderMenu(menuItems);
        })
        .catch(err => console.error('Error fetching menu:', err));
}

// Render menu items dynamically
function renderMenu(items) {
    const indianMenu = document.getElementById('indian-menu');
    const chineseMenu = document.getElementById('chinese-menu');
    const drinksMenu = document.getElementById('drinks-menu');

    // Clear previous menu items
    indianMenu.innerHTML = '';
    chineseMenu.innerHTML = '';
    drinksMenu.innerHTML = '';

    // Loop through items and generate HTML for each one
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        menuItem.setAttribute('data-name', item.name.toLowerCase());

        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name} - ₹${item.price}</span>
            <div class="quantity">
                <button onclick="decreaseQuantity('${item.id}', ${item.price})">-</button>
                <input type="text" id="${item.id}" value="0" readonly>
                <button onclick="increaseQuantity('${item.id}', ${item.price})">+</button>
            </div>
        `;

        // Append item to respective category
        if (item.category === 'Indian') indianMenu.appendChild(menuItem);
        else if (item.category === 'Chinese') chineseMenu.appendChild(menuItem);
        else if (item.category === 'Drinks') drinksMenu.appendChild(menuItem);
    });
}

// Increase quantity of an item
function increaseQuantity(id, price) {
    const input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
    totalAmount += price;
    updateBilling();
}

// Decrease quantity of an item
function decreaseQuantity(id, price) {
    const input = document.getElementById(id);
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        totalAmount -= price;
        updateBilling();
    }
}

// Update billing total
function updateBilling() {
    document.getElementById('billing').innerText = `Total: ₹${totalAmount}`;
}

// Handle Checkout button
function handleCheckout() {
    let confirmOrder = confirm("Please select order-type (Dine in or Takeaway)?");
    if (confirmOrder) {
        window.location.href = "order_type.html";
    }
}

// ✅ Fixed Search Functionality
function searchMenu() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    
    // Filter items based on search query
    const filteredItems = menuData.filter(item => item.name.toLowerCase().includes(query));
    
    // Re-render the menu with filtered items
    renderMenu(filteredItems);
}

// ✅ Fixed Voice Search Functionality
function startVoiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        document.getElementById('search-bar').value = speechResult;
        searchMenu();
    };

    recognition.start();
}

// Initialize menu on page load
window.onload = function() {
    fetchMenu();
};
