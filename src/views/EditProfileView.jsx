import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


function EditProfileView(props) {

    const {user} = useContext(AuthContext);

    return (
        <div>
            <h1>Edit your profile info</h1>

        </div>
    )
}

export default EditProfileView