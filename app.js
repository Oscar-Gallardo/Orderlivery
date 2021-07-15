require('dotenv').config()

const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')

const app = express()
const path = require('path')
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))
app.use(methodOverride())

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    acessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

// Link Resolver
const handellinkResolver = (doc) => {
  if (doc.type === 'about') {
    return '/about'
  }

  if (doc.type === 'blogs') {
    return `/blogs/${doc.uid}`
  }

  if (doc.type === 'contact') {
    return '/contact'
  }

  if (doc.type === 'drivers_app') {
    return '/drivers-app'
  }

  if (doc.type === 'faqs') {
    return '/faqs'
  }

  if (doc.type === 'restaurant_app') {
    return '/restaurant-app'
  }

  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.Link = handellinkResolver

  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async (api) => {
  const footer = await api.getSingle('footer')
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  return {
    footer,
    meta,
    navigation,
    preloader
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')

  res.render('pages/home', {
    ...defaults,
    home
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const about = await api.getSingle('about')

  res.render('pages/about', {
    ...defaults,
    about
  })
})

app.get('/blogs/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  const blogPost = await api.getByUID('blogs', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  blogPost.data.blog.forEach((content, index) => {
    console.log(content, index)
  })

  res.render('pages/blogs', {
    ...defaults,
    blogPost
  })
})

app.get('/contact', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const contact = await api.getSingle('contact')

  console.log(contact.data)

  res.render('pages/contact', {
    ...defaults,
    contact
  })
})

app.get('/faqs', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const faqs = await api.getSingle('faqs')

  console.log(faqs.data.body)

  res.render('pages/faqs', {
    ...defaults,
    faqs
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
