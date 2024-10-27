const { Link } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { UserPreview } from './UserPreview.jsx'

export function UserList({ users, onRemoveUser }) {


    if (!users) return <div>Loading...</div>
    return (
        <ul className="bug-list">
            {
                users.map((user) => (      
                        <li className="bug-preview" key={user._id}>
                            <UserPreview user={user} />
                            <div>
                                <button onClick={() => onRemoveUser(user._id)}>x</button>
                                {/* <button onClick={() => onEditUser(user)}>Edit</button> */}
                            </div>
                            {/* <Link to={`/user/${user._id}`}>Details</Link> */}
                        </li>
                ))
            }
        </ul >
    )
}
