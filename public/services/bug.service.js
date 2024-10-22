
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'
_createBugs()

export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
    getFilterFromParams
}


function query(filterBy = getDefaultFilter()) {
    
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)

    // return axios.get(BASE_URL)
    //     .then(res => res.data)
        // .then(bugs => {
        //     if (filterBy.title) {
        //         const regExp = new RegExp(filterBy.title, 'i')
        //         bugs = bugs.filter(bug => regExp.test(bug.title))
        //     }
        //     return bugs
        // })
}

// function getById(bugId) {
//     return storageService.get(STORAGE_KEY, bugId)
// }

function get(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .then(bug => _setNextPrevBugId(bug))
        .catch(err => {
            console.log('err:', err)
        })
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
    // return axios.get(BASE_URL + bugId + '/remove')
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, car).then(res => res.data)
    } else {
        return axios.post(BASE_URL, car).then(res => res.data)
    }
    
    // const url = BASE_URL + 'save'
    // let queryParams = `?title=${bug.title}`
    // if (bug._id) queryParams += `&_id=${bug._id}`
    // return axios.get(url + queryParams).then(res => res.data)
}


function getEmptyBug(title = '', description = '') {
    return { title, description }
}

function getDefaultFilter() {
    return { title: '', description: '', pageIdx: 0, sortBy: 'title', sortDir: 'false', minSeverity: 0, labels: ''}
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        title: searchParams.get('title') || defaultFilter.title,
        description: searchParams.get('description') || defaultFilter.description,
        pageIdx: searchParams.get('pageIdx') || defaultFilter.pageIdx,
        sortBy: searchParams.get('sortBy') || defaultFilter.sortBy,
        sortDir: searchParams.get('sortDir') || defaultFilter.sortDir,
        minSeverity: searchParams.get('minSeverity') || defaultFilter.minSeverity,
        labels: searchParams.get('labels') || defaultFilter.labels,
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                _id: "1NF1N1T3",
                title: "Infinite Loop Detected",
                description: "problem when clicking Save",
                severity: 4,
                createdAt: 1542107359454,
                labels: ['critical', 'need-CR', 'dev-branch']
            },
            {
                _id: "K3YB0RD",
                title: "Keyboard Not Found",
                description: "problem when clicking Save",
                severity: 3,
                createdAt: 1542107359454,
                labels: ['critical', 'need-CR', 'dev-branch']
            },
            {
                _id: "C0FF33",
                title: "404 Coffee Not Found",
                description: "problem when clicking Save",
                severity: 2,
                createdAt: 1542107359454,
                labels: ['critical', 'need-CR', 'dev-branch']
            },
            {
                _id: "G0053",
                title: "Unexpected Response",
                description: "problem when clicking Save",
                severity: 1,
                createdAt: 1542107359454,
                labels: ['critical', 'need-CR', 'dev-branch']
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }
}

function _setNextPrevBugId(bug) {
    return query().then((bugs) => {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
        const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
        bug.nextBugId = nextBug._id
        bug.prevBugId = prevBug._id
        return bug
    })
}