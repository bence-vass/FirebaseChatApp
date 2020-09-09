import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {firebaseConnect, isLoaded} from "react-redux-firebase";
import {compose} from "redux";

class UserList extends Component {
    render() {
        const {users} = this.props
        if(isLoaded(users)){
            return (
                <div>
                    <ul>
                    {Object.entries(users).map((e,i)=> {
                        console.log(e)
                        if (e[0] === this.props.auth.uid) {
                            return null
                        } else {
                            return <li key={i}>
                                user:
                                {e[1].email}
                            </li>
                        }
                    })}

                    </ul>
                </div>
            );
        } else {
            return <div>Loading...</div>
        }

    }
}

export default compose(
    withRouter,
    connect(
        ({firebase: {auth, profile}}) => ({
            auth,
            profile
        })),
    firebaseConnect([
        {
            path: 'users',
            storeAs: 'users'
        }
    ]),
    connect((state, props) => ({
        users: state.firebase.data.users
    }))
)(UserList)