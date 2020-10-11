const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const checkLogin = require('./checkLogin')
const parseCookies = require('./parseCookies')

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

// 路由
// decide whether to go to personal or login page
app.get('/', (req, res) => {
  const cookies = parseCookies(req) // get the cookies object
  if (cookies && cookies.logged === 'true') {
    const user = cookies.name
    res.render('index', { user })
  } else {
    res.redirect('/login') // redirect to login page by default
  }
})
// log out
app.post('/', (req, res) => {
  res.setHeader('Set-Cookie', ['logged=false'])
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
    res.setHeader('Set-Cookie', ['logged=true', `name=${user.firstName}`])
    res.redirect('/')
  } else {
    res.render('login', { loginFail: true })
  }
})

// Start the server
app.listen(port, () => {
  console.log('The express server is running.')
})
