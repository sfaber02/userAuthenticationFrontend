import React, { useEffect, useState } from 'react';


const NavBar = (props) => {
    const [user, setUser] = useState({});

    useEffect(() => setUser(props.user), [props.user]);

    // const { name, email, token } = props.users;

    return (
        <div id='navBarContainer'>
            <p>{user.name}</p>
            <button id='logout' onClick={props.logout} >Logout</button>
        </div>
    )
}


export { NavBar };