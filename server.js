const mysql = require('mysql2');
const express = require('express');
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
// //the db object is using the query() method
// db.query('SELECT * FROM candidates', (err, rows) => {
//   console.log(rows);
// });

// GET a single candidate
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
  if (err) {
    console.log(err);
  }
  console.log(row);
});

// //delete a candidate.
// // ? that denotes a placeholder, making this a prepared statement
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
  VALUES (?,?,?,?)`;

const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

//GET test route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
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