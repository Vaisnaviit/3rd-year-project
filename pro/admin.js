// Fetch menu items and render table dynamically
function fetchMenuItems() {
    fetch("http://localhost:3000/api/menu")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            return response.json();
        })
        .then(items => {
            const menuTableBody = document.querySelector("#menu-table tbody");
            menuTableBody.innerHTML = "";
            if (Array.isArray(items)) {
                items.forEach(item => {
                    menuTableBody.innerHTML += `
                        <tr data-id="${item.id}">
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.category}</td>
                            <td>₹${item.price}</td>
                            <td><img src="${item.image}" alt="${item.name}" width="50" onerror="this.src='default-image.jpg'"></td>
                            <td>
                                <button class="delete-btn" data-id="${item.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                // Attach event listeners for dynamic delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        deleteMenuItem(id);
                    });
                });
            } else {
                console.error('Expected an array but got:', items);
            }
        })
        .catch(error => {
            console.error('Error fetching menu items:', error);
        });
}

// Add new menu item dynamically
document.querySelector("#add-menu-item-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#menu-name").value;
    const category = document.querySelector("#menu-category").value;
    const price = document.querySelector("#menu-price").value;
    const image = document.querySelector("#menu-image").value;

    fetch("http://localhost:3000/api/add-menu-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, price, image }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add menu item');
        }
        return response.json();
    })
    .then(() => {
        alert("Menu item added successfully");
        fetchMenuItems();  // Re-fetch menu items to update the table
        document.querySelector("#add-menu-item-form").reset();  // Reset the form
    })
    .catch(error => {
        console.error('Error adding menu item:', error);
    });
});

// Delete menu item dynamically
function deleteMenuItem(id) {
    fetch(`http://localhost:3000/api/delete-menu-item/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete menu item');
            }
            alert("Menu item deleted successfully");
            fetchMenuItems();  // Re-fetch menu items to update the table
        })
        .catch(error => {
            console.error('Error deleting menu item:', error);
        });
}

// Fetch orders and render table dynamically
function fetchOrders() {
    fetch("http://localhost:3000/api/orders")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            return response.json();
        })
        .then(orders => {
            const ordersTableBody = document.querySelector("#orders-table tbody");
            ordersTableBody.innerHTML = "";
            if (Array.isArray(orders)) {
                orders.forEach(order => {
                    ordersTableBody.innerHTML += `
                        <tr>
                            <td>${order.order_id}</td>
                            <td>${order.user_name}</td>
                            <td>${order.user_email}</td>
                            <td>${order.ordered_food}</td>
                            <td>₹${order.payment}</td>
                        </tr>
                    `;
                });
            } else {
                console.error('Expected an array but got:', orders);
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
}

// Initialize functions
fetchMenuItems();  // Fetch menu items to display on page load
fetchOrders();  // Fetch orders to display on page load
