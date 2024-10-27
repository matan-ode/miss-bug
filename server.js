import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'



import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        createdAt: Date.now()
    }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

//* UPDATE
app.put('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        severity: req.body.severity,
        description: req.body.description,
    }

    bugService.save(bugToSave, loggedinUser)
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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
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

// User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

//* REMOVE
app.delete('/api/user/:userId', (req, res) => {

    const { userId } = req.params
    userService.remove(userId)
        .then(() => res.send(`user ${userId} removed successfully!`))
        .catch(err => {
            loggerService.error('Cannot remove user', err)
            res.status(500).send('Cannot remove user')
        })
})


// Auth API

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)


// const port = 3030
// app.listen(port, () =>
//     loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
// )