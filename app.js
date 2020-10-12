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

// 路由
// decide whether to go to personal or login page
app.get('/', (req, res) => {
  // console.log('req.session: ', req.session)
  // console.log('req.session.name: ', req.session.name)

  const session = req.session // access session data
  if (session.name) {
    res.render('index', { user: session.name })
  } else {
    res.redirect('/login') // redirect to login page by default
  }
})
// login page
app.get('/login', (req, res) => {
  res.render('login')
})
// check the login information
app.post('/login', (req, res) => {
  const { account, password } = req.body
  const user = checkLogin(account, password)
  if (user) {
    req.session.name = user.firstName // add session data
    res.redirect('/')
  } else {
    res.render('login', { loginFail: true })
  }
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
