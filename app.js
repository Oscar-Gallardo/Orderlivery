const express = require('express')
const app = express()
const path = require('path')
const port = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/restaurants', (req, res) => {
  res.render('pages/restaurants')
})

app.get('/drivers', (req, res) => {
  res.render('pages/drivers')
})

app.get('/faqs', (req, res) => {
  res.render('pages/faqs')
})

app.get('/contact', (req, res) => {
  res.render('pages/contact')
})

app.get('/get-the-app', (req, res) => {
  res.render('pages/get-the-app')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
