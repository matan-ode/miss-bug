const { useState, useEffect } = React

const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'

export function AppHeader() {
    const navigate = useNavigate()
    const [user, setUser] = useState(userService.getLoggedinUser())

    function onLogout() {
        userService.logout()
            .then(() => onSetUser(null))
            .catch(err => showErrorMsg('OOPs try again'))
    }

    function onSetUser(user) {
        setUser(user)
        navigate('/')
    }

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <header className='container'>
            <UserMsg />
            <section>
                <nav>
                    <NavLink to="/">Home</NavLink> |
                    <NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink> |
                    <NavLink to="/profile">Profile</NavLink> |
                    <NavLink to="/user">Users</NavLink>
                </nav>
                <h1>Bugs are Forever</h1>
            </section>

            {user ? (
                <section>
                    <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                    <button onClick={onLogout}>Logout</button>
                </section>
            ) : (
                <section>
                    <LoginSignup onSetUser={onSetUser} />
                </section>
            )}
        </header>
    )
}
