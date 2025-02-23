const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = 3000;
const tables = {};
const TABLES_COUNT = 10;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds


// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from "public" folder

// MySQL Database Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vashu1905', // Replace with your MySQL root password
  database: 'project', // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the MySQL database.');
});

// Route to handle signup
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  const query = 'INSERT INTO user_login (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err,) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).send('Error signing up.');
    } else {
      res.status(201).send('User signed up successfully.');
    }
  });
});

// Route to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM user_login WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Error logging in.');
    } else if (results.length > 0) {
      // Successful login
      res.status(200).send('Login successful.');
    } else {
      // Invalid credentials
      res.status(401).send('Invalid email or password.');
    }
  });
});

app.get('/api/menu', (req, res) => {
  db.query('SELECT * FROM menu_items', (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Database error');
      } else {
          const validatedResults = results.map(item => {
              if (!item.category) {
                  console.warn(`Menu item with ID ${item.id} has no category`);
              }
              return item;
          });
          res.json(validatedResults);
      }
  });
});


app.post('/api/menu', (req, res) => {
  const { name, description, price, image } = req.body;
  db.query(
    'INSERT INTO menu_items (name, description, price, image) VALUES (?, ?, ?, ?)',
    [name, description, price, image],
    (err, result) => {
      if (err) throw err;
      res.json({ success: true, message: 'Menu item added!' });
    }
  );
});

app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, image, category } = req.body;
  const query = 'UPDATE menu_items SET name = ?, price = ?, image = ?, category = ? WHERE id = ?';
  db.query(query, [name, price, image, category, id], (err) => {
      if (err) {
          console.error('Error updating menu item:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Menu item updated successfully' });
  });
});

// Delete menu item
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM menu_items WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json({ success: true, message: 'Menu item deleted!' });
  });
});



// Clear expired reservations
function clearExpiredReservations() {
    const now = Date.now();
    for (const [table, timestamp] of Object.entries(tables)) {
        if (now - timestamp > SESSION_TIMEOUT) {
            delete tables[table];
        }
    }
}
// Fetch all orders with user details
app.get("/api/orders", (req, res) => {
    const sql = `
        SELECT o.id as order_id, u.name as user_name, u.email as user_email, o.ordered_food, o.payment
        FROM orders o
        JOIN user_login u ON o.user_id = u.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// API to get available tables
app.get('/api/tables', (req, res) => {
    clearExpiredReservations();
    const reservedTables = Object.keys(tables).map(Number);
    const availableTables = Array.from({ length: TABLES_COUNT }, (_, i) => i + 1).filter(
        (table) => !reservedTables.includes(table)
    );
    res.json({ availableTables });
});

// API to select a table
app.post('/api/tables/select', (req, res) => {
    const { table } = req.body;

    clearExpiredReservations();

    if (!table || table < 1 || table > TABLES_COUNT) {
        return res.status(400).json({ message: 'Invalid table number' });
    }

    if (tables[table]) {
        return res.status(400).json({ message: `Table ${table} is already reserved` });
    }

    // Reserve the table
    tables[table] = Date.now();
    res.json({ message: `Table ${table} reserved successfully` });
});

const payments = {};

// Handle cash payment
app.post('/api/payment/cash', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Store payment information (for demonstration purposes)
  payments[userId] = {
    method: 'Cash',
    timestamp: new Date(),
  };

  res.json({ message: 'Thank you for choosing Counter Cash. Please proceed to the counter to complete your payment.' });
});

// Handle UPI payment
app.post('/api/payment/upi', (req, res) => {
  const { userId, upiId } = req.body;

  if (!userId || !upiId) {
    return res.status(400).json({ message: 'User ID and UPI ID are required' });
  }

  // Store payment information (for demonstration purposes)
  payments[userId] = {
    method: 'UPI',
    upiId,
    timestamp: new Date(),
  };

  res.json({ message: 'Thank you for using UPI. Your payment is being processed.' });
});

// Endpoint to view all payments (for debugging/testing)
app.get('/api/payments', (req, res) => {
  res.json(payments);
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
