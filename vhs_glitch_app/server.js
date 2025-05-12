const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 12000; // Using the port from runtime information

// Enable CORS for all routes
app.use(cors({
  origin: '*'
}));

// Serve static files
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
  console.log(`Access the app at https://work-1-kzjyiollwuiyxndh.prod-runtime.all-hands.dev`);
});