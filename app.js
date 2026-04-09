
// // Dependencies
const puppeteer = require('puppeteer')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require(`express`)
const app = express()


// // Stateless Engine Setup

// // 1) import stateless engine module and destructure rendering function
const { renderPage } = require('./engine/statelessEngine.js')
if (renderPage) {
  console.log('Stateless Pages Module: import successful')
} else {
  console.log('Stateless Pages Module: import failed')
  server.close();
}

// // 2) configure stateless engine with express
app.engine('slps', renderPage)
console.log('Stateless Pages Engine configured')

// // 3) set stateless engine as default template engine for this express app
app.set('view engine', 'slps')
console.log('Stateless Pages Engine set as default template engine')


// // Configuration
const useable = ['http://localhost:2152', 'http://localhost:2152/home'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS origin: ' + origin)
    if (useable.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
}
app.set('views', './view')

// // Middleware
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

// // Routes
app.get('/', (req, res) => {
  res.redirect(301, '/main')
})

app.get('/main', (req, res) => {
  res.render('main', {})
})

// // build => convert => serve
app.post('/build/:id', cors(corsOptions), (req, res, next) => {
  try {
    if (Object.hasOwn(req.body, 'tempParams') && typeof(req.body.tempParams) === 'object') {
      const ID = req.params.id;
      const tempParams = req.body.tempParams;

      if (ID === 'default') {

        res.render('default', {
          'title': tempParams?.title === undefined ? '' : tempParams.title,
          'websiteTitle': tempParams?.websiteTitle === undefined ? '' : tempParams.websiteTitle,
          'pageTitle': tempParams?.pageTitle === undefined ? '' : tempParams.pageTitle,
          'copyrightYear': tempParams?.copyrightYear === undefined ? '' : tempParams.copyrightYear,
          'copyrightName': tempParams?.copyrightName === undefined ? '' : tempParams.copyrightName,
        }, async (err, htmlContent) => {
          if (err) return next(`ERROR: render failed | ${err}`);
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setContent(htmlContent);
          await page.pdf({
            path: './public/pdf/page.pdf',
            format: 'A4',
            printBackground: true
          });
          await browser.close();
          res.sendFile('page.pdf', {root: path.join(__dirname, 'public', 'pdf', )}, (err) => {if (err) {return next(`ERROR: send file failed | ${err}`)} });
        })

      } else {
        next('ERROR: template not found')
      }
    } else {
      next('ERROR: failed parameter validation')
    }
  } catch (error) {
    next(error)
  }
})

// // Listener
app.listen(2152, () => {
  console.log('Server online at http://localhost:2152/')
})
