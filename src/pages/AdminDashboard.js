import React, {Component} from 'react';
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {firebaseConnect, isLoaded} from "react-redux-firebase";
import {assignUser} from "../utils/firebaseFunctions";
import withPermissionHoc from "../utils/permissionHOC";

class AdminDashboard extends Component {
    render() {
        console.log(this.props)
        if (isLoaded(this.props.users) && isLoaded(this.props.moderators)) {
            return (
                <div>
                    <h1>Admin Dashboard</h1>
                    <h1>Moderators</h1>
                    <ul>
                        {this.props.moderators && this.props.moderators.length !== 0 ?
                            Object.entries(this.props.moderators).map((e, i) => {
                                if (e[0] === this.props.auth.uid) {
                                    return null
                                } else {
                                    return <li key={i}>
                                        user:
                                        {e[1].email}
                                        <button onClick={async () => {
                                            await assignUser(this.props.firebase, e[0])
                                        }}>Set to User
                                        </button>
                                    </li>
                                }
                            })
                            :
                            <span>No moderators</span>
                        }

                    </ul>
                    <h1>Users</h1>
                    <ul>
                        {this.props.users && this.props.users.length !== 0 ?
                            Object.entries(this.props.users).map((e, i) => {
                                if (e[0] === this.props.auth.uid) {
                                    return null
                                } else {
                                    return <li key={i}>
                                        user:
                                        {e[1].email}
                                        <button onClick={async () => {
                                            await assignUser(this.props.firebase, e[0], 'moderator')
                                        }}>Set to Moderator
                                        </button>
                                    </li>
                                }
                            })
                            :
                            <span>No users</span>
                        }

                    </ul>
                </div>
            );
        } else {
            return <div>Loading ...</div>
        }

    }
}


export default compose(
    withPermissionHoc(),
    withRouter,
    connect(
        ({firebase: {auth, profile}}) => ({
            auth,
            profile
        })),
    firebaseConnect([
        {
            path: 'users',
            queryParams: [
                'orderByChild=role',
                'equalTo=moderator'
            ],
            storeAs: 'moderators'
        },
        {
            path: 'users',
            queryParams: [
                'orderByChild=role',
                'equalTo=null'
            ],
            storeAs: 'users'
        }
    ]),
    connect((state) => ({
        moderators: state.firebase.data.moderators,
        users: state.firebase.data.users,
    }))
)(AdminDashboard)