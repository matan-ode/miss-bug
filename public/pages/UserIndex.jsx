import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { UserList } from '../cmps/UserList.jsx'

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function UserIndex() {
    const [users, setUsers] = useState(null)
    // const [searchParams, setSearchParams] = useSearchParams()

    // const [filterBy, setFilterBy] = useState(bugService.getFilterFromParams(searchParams))

    const user = userService.getLoggedinUser()
    if (!user || !user.isAdmin) return 'For admins only.'

    useEffect(() => {
        loadUsers()        
    }, [])

    function loadUsers() {
        userService.query().then(setUsers)
    }

    function onRemoveUser(userId) {
        userService
            .remove(userId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const usersToUpdate = users.filter((user) => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('user removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveUser ->', err)
                showErrorMsg('Cannot remove user')
            })
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Users</h3>
            </section>
            <main>
                <UserList users={users} onRemoveUser={onRemoveUser} />
            </main>
        </main>
    )
}
