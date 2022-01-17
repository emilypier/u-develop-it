const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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