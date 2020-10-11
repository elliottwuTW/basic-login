const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

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

// routes
app.get('/', (req, res) => {
  res.render('login')
})

app.post('/', (req, res) => {
  const { account, password } = req.body

  const user = checkLogin(account, password)
  if (user) {
    res.render('index', { user })
  } else {
    res.render('login', { loginFail: true })
  }
})

// Start the server
app.listen(port, () => {
  console.log('The express server is running.')
})
