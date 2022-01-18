const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Powell94!',
    database: 'election'
  },
  console.log('Connects to the election database.')
);

// Get all candidates
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT * FROM candidates`;

  db.query(sql, (err, rows) => { //the db object  using the query() method
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ //sends this response as JSON object to browser
      message: 'success',
      data: rows
    });
  });
});

// Get a single candidate
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id]; //bc params can be accepted in database call as an array, params is assigned as an array w/ a single element

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`; //? that denotes a placeholder, making this a prepared statement
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => { //obj. destructuring to pull body property out of the request obj.
  const errors = inputCheck(
    body, 
    'first_name', 
    'last_name', 
    'industry_connected'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

//route to handle user requests that aren't supported by the app. Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

//function that will start the Express.js server on port 3001.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});