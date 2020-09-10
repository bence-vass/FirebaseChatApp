import React, {Component} from 'react';
import {withRouter, Link} from "react-router-dom";
import {connect} from "react-redux";
import {firebaseConnect, isLoaded} from "react-redux-firebase";
import {compose} from "redux";
import {CHAT_URL} from "../urlPaths";

class UserList extends Component {
    render() {
        const {users} = this.props
        if (isLoaded(users)) {
            return (
                <div>
                    <ul>
                        {Object.entries(users).map((e, i) => {
                            if (e[0] === this.props.auth.uid) {
                                return null
                            } else {
                                return (
                                    <Link to={CHAT_URL + '/' + e[0]} key={i}>
                                        <li>
                                            user:
                                            {e[1].email}
                                        </li>
                                    </Link>
                                )
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
    connect((state,) => ({
        users: state.firebase.data.users
    }))
)(UserList)