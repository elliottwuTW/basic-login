const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

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

// Sign for cookie
app.use(cookieParser('basic-login'))

// 路由
// decide whether to go to personal or login page
app.get('/', (req, res) => {
  // console.log('req.cookies: ', req.cookies)
  // console.log('req.signedCookies: ', req.signedCookies)

  const cookies = req.signedCookies // read the signed cookies
  if (cookies && cookies.name) {
    res.render('index', { user: cookies.name })
  } else {
    res.redirect('/login') // redirect to login page by default
  }
})
// log out
app.post('/logout', (req, res) => {
  res.clearCookie('name')
  res.redirect('/login')
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
    res.cookie('name', `${user.firstName}`, {
      signed: true,
      maxAge: 10000 // expire after 10s
    })
    res.redirect('/')
  } else {
    res.render('login', { loginFail: true })
  }
})

// Start the server
app.listen(port, () => {
  console.log('The express server is running.')
})
