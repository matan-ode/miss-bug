import express from 'express'
import cookieParser from 'cookie-parser'


import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())

// app.get('/', (req, res) => res.send('Hello there'))

// app.listen(3030, () => console.log('Server ready at port 3030'))

//* Express Routing:
//* READ LIST
app.get('/api/bug', (req, res) => {
    bugService.query()
    .then(bugs => res.send(bugs))
    .catch(err => {
        loggerService.error('Cannot get bugs', err)
        res.status(500).send('Cannot get bugs')
    })
})

//* SAVE
app.get('/api/bug/save', (req, res) => { 
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

//* READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
 })

 //* REMOVE
app.get('/api/bug/:bugId/remove', (req, res) => { 
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed successfully!`))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})


//* Cookies
app.get('/puki', (req, res) => {
    let visitedCount = req.cookies.visitedCount || 0
    visitedCount++
    res.cookie('visitedCount', visitedCount, { maxAge: 5 * 1000 })
    console.log('visitedCount:', visitedCount)
    res.send('Hello Puki')
})


const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)