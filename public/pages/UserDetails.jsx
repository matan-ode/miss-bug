import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'

import { BugList } from '../cmps/BugList.jsx'

const { useState, useEffect } = React

export function UserDetails() {

    const [user, setUser] = useState(userService.getLoggedinUser())
    const [isUserPage, setIsUserPage] = useState(true)

    const [bugs, setBugs] = useState(null)

    useEffect(() => {
        loadBugs()
    }, [])

    function loadBugs() {
        bugService.query().then(setBugs)
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    if (!user) return <p>Login, or sign-up first!</p>

    return (
        <React.Fragment>
            <section>
                <BugList onEditBug={onEditBug} onRemoveBug={onRemoveBug} bugs={bugs} isUserPage={isUserPage} />
            </section>
        </React.Fragment>
    )
}