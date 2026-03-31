// Dependencies
const bodyParser = require("body-parser");
// const path = require('path'); // for static file directory "public"
const express = require(`express`);
const app = express();

// Engine Setup

// 1) import stateless engine module and destructure rendering function
const { renderPage } = require('./engine/statelessEngine.js');
if (renderPage) {
  console.log('Stateless Pages Module: import successful');
} else {
  console.log('Stateless Pages Module: import failed');
  server.close();
}

// 2) configure stateless engine with express
app.engine('slps', renderPage);
console.log('Stateless Pages Engine configuration successful');

// 3) set stateless engine as default template engine for this express app
app.set('view engine', 'slps');
console.log('Stateless Pages Engine set as default template engine');

// Test Data Structure
const parameters = {

  // engine configuration parameters

  demarcator: '#', // keep demarcator as a single character unique to syntax; default = '#'

  // customizable document parameters

  // test document (singular parameter template)
  testParameter: 'If you can read this, the test has passed.',

  // default page (plural parameter template)
  title: 'Title', // controls tab name
  websiteTitle: 'Website Title', // controls the title in the website header tag
  pageTitle: 'Title of the Page', // controls the title at the top of the main tag
  copyrightYear: '2026', // controls year data in copyright statement in footer tag
  copyrightName: 'Blake Thollaug' // controls name data in copyright statement in footer tag
};

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname, 'public'))); // serve static files from the public directory

// Routes
app.get('/show', (req, res) => {
  res.render(`index`, parameters)
})

app.get(`/`, (req, res) => {
  res.redirect(307, '/show')
})

app.get('/test', (req, res) => {
  res.render('test', parameters)
})

// Listener
app.listen(3000, () => {
  console.log('Server online at http://localhost:3000/')
})