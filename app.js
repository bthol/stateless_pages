// Dependencies
// const path = require('path'); // for static file directory "public"
const bodyParser = require("body-parser");
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
console.log('Stateless Pages Engine configured');

// 3) set stateless engine as default template engine for this express app
app.set('view engine', 'slps');
console.log('Stateless Pages Engine set as default template engine');

// Server Configuration

// Specify the views directory
app.set('views', './views'); 

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname, 'public'))); // serve static files from the public directory

// POST validation functionality
const validate = (req) => {
  // ensure that post request has valid properties for passing parameters
  if ( Object.hasOwn(req.body, "parameters") ) {
    if ( typeof(req.body.parameters) === "object" ) {
      if ( Object.keys(req.body.parameters).length > 0 ) {
        return true;
      }
    }
  }
  return false;
};

// Routes
app.get('/hello-world', (req, res) => {
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  // redirect status codes:
  // 301 = permanent redirect
  // 302 = temporary redirect
  res.redirect(301, '/hello-world')
})

app.get('/test', (req, res) => {
  try {
    res.render('test', {"testParameter": "If you can read this, the test has passed."})
  } catch (error) {
    throw new Error(error)
  }
})

app.post('/test', (req, res, next) => {
  if (validate(req)) {
    try {
      res.render('test', req.body.parameters)
    } catch (error) {
      next(error)
    }
  } else {
    next('ERROR: POST request failed validation')
  }
})

// Listener
app.listen(3000, () => {
  console.log('Server online at http://localhost:3000/')
})