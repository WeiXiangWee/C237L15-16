const express = require('express'); 
const mysql = require('mysql2'); 
const app = express(); 
 
// Create MySQL connection 
const connection = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: 'Wwx_021006', 
    database: 'c237_studentlistapp' 
}); 
 
connection.connect((err) => { 
    if (err) { 
        console.error('Error connecting to MySQL:', err); 
        return; 
    } 
    console.log('Connected to MySQL database'); 
}); 
 
// Set up view engine 
app.set('view engine', 'ejs'); 
//  enable static files 
app.use(express.static('public')); 
//enable form processing
app.use(express.urlencoded({
  extended: false
}));
 
// Define routes 
// Example: 
// app.get('/', (req, res) => { 
//     connection.query('SELECT * FROM TABLE', (error, results) => { 
//       if (error) throw error; 
//       res.render('index', { results }); // Render HTML page with data 
//     }); 
// });

// Define routes
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM student';
  // Fetch data from MySQL
  connection.query( sql , (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving student'); 
    }
   // Render HTML page with data
   res.render('index', { student: results });
  });
});

app.get('/student/:id', (req, res) => {
  // Extract the product ID from the request parameters
  const studentid = req.params.id;
  const sql = 'SELECT * FROM student WHERE studentid = ?';
  // Fetch data from MySQL based on the product ID
  connection.query( sql , [studentid], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving student by ID'); 
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the product data
      res.render('student', { student: results[0] });
    } else {
      // If no product with the given ID was found
      res.send('Student not found');
    }
  });
});


app.get('/addStudent', (req, res) => {
  res.render('addStudent'); 
});

app.post('/addStudent', (req, res) => {
  // Extract product data from the request body
  const { name, dob, contact, image } = req.body;
  const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';
  // Insert the new product into the database
  connection.query( sql , [name, dob, contact, image], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error adding student:", error);
      res.send('Error adding student');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});




const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 