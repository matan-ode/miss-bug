import express from 'express'
// import cookieParser from 'cookie-parser'


// import { bugService } from './services/bug.service.js'
// import { loggerService } from './services/logger.service.js'

const app = express()

// app.use(express.static('public'))
// app.use(cookieParser())

app.get('/', (req, res) => res.send('Hello there'))

app.listen(3030, () => console.log('Server ready at port 3030'))

// app.get('/api/bug', (req, res) => {
//     bugService.query()
//     .then(bugs => res.send(bugs))
//     .catch(err => {
//         loggerService.error('Cannot get bugs', err)
//         res.status(500).send('Cannot get bugs')
//     })
// })

// app.get('/api/bug/save', (req, res) => { })

// app.get('/api/bug/:bugId', (req, res) => { })

// app.get('/api/bug/:bugId/remove', (req, res) => { })