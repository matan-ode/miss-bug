import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')
// console.log(bugs);
const PAGE_SIZE = 2


export const bugService = {
    query,
    getById,
    save,
    remove
}


function query(filterBy) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.sortBy) {
                const dir = (filterBy.sortDir === 'true') ? -1 : 1
                if (filterBy.sortBy === 'title') {
                    bugs.sort((b1, b2) => dir * (b1.title.localeCompare(b2.title)))
                }
                else if (filterBy.sortBy === 'severity') {
                    bugs.sort((b1, b2) => dir * (b1.severity - b2.severity))
                }
                else if (filterBy.sortBy === 'createdAt') {
                    bugs.sort((b1, b2) => dir * (b1.createdAt - b2.createdAt))
                }
            }
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.description) {
                const regExp = new RegExp(filterBy.description, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.description))
            }
            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }
            if (filterBy.labels) {
                bugs = bugs.filter(bug => bug.labels.some(label => filterBy.labels.includes(label)))
            }
            if (filterBy.pageIdx) {
                const startIdx = (filterBy.pageIdx * PAGE_SIZE)
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            // if (filterBy.createdAt) {
            //     bugs = bugs.filter(bug => bug.createdAt === filterBy.createdAt)
            // }
            return bugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug', bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug', bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}