const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')

const checkLogin = require('./checkLogin')

const app = express()
const port = 3000

// template engine
app.engine('hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// set the session options
const sessionOptions = {
  secret: 'login-express-session',
  name: 'sessionID',
  cookie: {
    maxAge: 10000,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionOptions))

// check if user is already logged in
const requireLogin = (req, res, next) => {
  if (!req.session.name) {
    return res.redirect('/login')
  }
  return next()
}

// check if user exists
const checkUser = (req, res, next) => {
  const { account, password } = req.body
  const user = checkLogin(account, password)
  if (!user) {
    return res.render('login', { loginFail: true })
  }
  req.session.name = user.firstName
  return next()
}

// main page
app.get('/', requireLogin, (req, res) => {
  res.render('index', { user: req.session.name })
})
// login page
app.get('/login', (req, res) => {
  res.render('login')
})
// check the login information
app.post('/login', checkUser, (req, res) => {
  res.redirect('/')
})
// log out
app.post('/logout', (req, res) => {
  req.session.destroy() // destroy session data
  res.redirect('/login')
})

// Start the server
app.listen(port, () => {
  console.log('The express server is running.')
})
