// Dependencies
const bodyParser = require("body-parser");
const path = require('path'); // for static file directory "public"
const express = require(`express`);
const app = express();

// Engine Setup

// 1) import stateless engine module and destructure functions
const { renderStateless } = require('./engine/statelessEngine.js');
if (renderStateless) {
  console.log('Stateless Pages Module: import successful');
} else {
  console.log('Stateless Pages Module: import failed');
  server.close();
}

// 2) configure stateless engine with express
app.engine('slps', renderStateless);
console.log('Stateless Pages Engine configuration successful');

// 3) set stateless engine as default template engine for this express app
app.set('view engine', 'slps');
console.log('Stateless Pages Engine set as default template engine');

// Engine Parameters
const parameters = {
  demarcator: '#', // keep demarcator as a single character unique to HTML syntax
  title: 'Title',
  websiteTitle: 'Website Title',
  pageTitle: 'Title of the Page',
  copyrightYear: '2026',
  copyrightName: 'Blake Thollaug'
};

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files from the public directory

// Routes
app.get(`/`, (req, res) => {
  res.render(`index`, parameters)
});

// Listener
app.listen(3000, () => {
  console.log(`Server online at http://localhost:${3000}/`)
});