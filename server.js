import express from 'express'
import cookieParser from 'cookie-parser'


import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello there'))

// app.listen(3030, () => console.log('Server ready at port 3030'))

//* Express Routing:
//* READ LIST
app.get('/api/bug', (req, res) => {

    const { title = '', description = '', pageIdx = 0, sortBy = 'title', sortDir = 'false', minSeverity = 0, labels = '' } = req.query

    const filterBy = {
        title,
        description,
        pageIdx,
        sortBy,
        sortDir,
        minSeverity,
        labels
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

//* ADD
app.post('/api/bug', (req, res) => {
    const bugToSave = {
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

//* UPDATE
app.put('/api/bug', (req, res) => {
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
    let visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    // visitedBugs.push(bugId)
    if (visitedBugs.time - new Date > 7000) visitedBugs = []
    const jsonVisitedBugs = JSON.stringify(visitedBugs)
    res.cookie('visitedBugs', jsonVisitedBugs, { maxAge: 7 * 1000 })
    console.log('visitedBugs:', visitedBugs)

    if (visitedBugs.length > 3) {
        return res.status(401).send('Wait for a bit')
    }

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })

})

//* REMOVE
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed successfully!`))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

//* Cookies
// app.get('/api/bug/:bugId', (req, res) => {
//     const { bugId } = req.params

//     let visitedBugs = JSON.parse(req.cookies.visitedBugs) || []
//     if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
//     res.cookie('visitedBugs', JSON.stringify(visitedBugs))
//     console.log('visitedBugs:', JSON.stringify(visitedBugs))
//     console.log('hiiii')
//     res.send('Hello Puki')
// })

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)