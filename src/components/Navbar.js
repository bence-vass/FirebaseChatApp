import React, {Component} from 'react';
import {compose} from "redux";
import {connect} from "react-redux";
import {isEmpty, isLoaded, withFirestore} from "react-redux-firebase";
import {Link} from "react-router-dom";
import {ADMIN_DASHBOARD_URL, CHAT_URL, SIGN_IN_URL, SIGN_UP_URL} from "../urlPaths";

class Navbar extends Component {
    render() {
        const {auth} = this.props
        return (
            <div>
                {isLoaded(auth) && isEmpty(auth) ?
                    <ul>
                        <Link to={SIGN_UP_URL}><li>Sign Up</li></Link>
                        <Link to={SIGN_IN_URL}><li>Sign In</li></Link>
                    </ul>
                    :
                    <ul>
                        <Link to={CHAT_URL}><li>Chat</li></Link>
                        <Link to={ADMIN_DASHBOARD_URL}><li>Dashboard</li></Link>

                        <li onClick={()=>{
                            this.props.firebase.logout()
                        }}>Logout</li>
                    </ul>
                }
            </div>
        );
    }
}

export default compose(
    withFirestore,
    connect(
        ({firebase: {auth, profile}}) => ({
            auth,
            profile
        })),
)(Navbar)