const express = require('express')
const mongoose = require('mongoose')
const redis = require('redis')
const ShortUrl = require('./models/shortUrl')
const app = express()
const redisClient = redis.createClient()

redisClient.on('error', (err) => {
  console.log('Redis Error:', err)
})

async function connectRedis() {
  await redisClient.connect()
  console.log('Redis Connected')
}

connectRedis()
mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {

  // Check Redis first
  const cachedUrl = await redisClient.get(req.params.shortUrl)

  if (cachedUrl) {
    console.log('Cache Hit')

    const shortUrl = await ShortUrl.findOne({
      short: req.params.shortUrl
    })

    if (shortUrl) {
      shortUrl.clicks++
      await shortUrl.save()
    }

    return res.redirect(cachedUrl)
  }

  console.log('Cache Miss')

  const shortUrl = await ShortUrl.findOne({
    short: req.params.shortUrl
  })

  if (shortUrl == null)
    return res.sendStatus(404)

  // Store in Redis for 1 hour
  await redisClient.set(
    req.params.shortUrl,
    shortUrl.full,
    {
      EX: 3600
    }
  )

  shortUrl.clicks++
  await shortUrl.save()

  res.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 5000);