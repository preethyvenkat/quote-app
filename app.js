// app.js
const express = require('express');
const app = express();
const port = 3000;

const quotes = [
  "Do not wait for the perfect moment, take the moment and make it perfect.",
  "Stay hungry, stay foolish. – Steve Jobs",
  "Your time is limited, don’t waste it living someone else’s life.",
  "Great things never came from comfort zones.",
  "Push yourself, because no one else is going to do it for you."
];

app.get('/', (req, res) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  res.send(`<h1>Quote of the Day:</h1><p>${quote}</p>`);
});

app.listen(port, () => {
  console.log(`Quote app listening at http://localhost:${port}`);
});
