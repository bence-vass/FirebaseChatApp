import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {withFirestore, isEmpty, isLoaded} from "react-redux-firebase";
import {connect} from "react-redux";
import {CHAT_URL, SIGN_IN_URL, SIGN_UP_URL} from "./urlPaths";

class Home extends Component {
    render() {
        console.log(this.props)
        const {auth} = this.props
        return (
            <div>
                <h1>Firebase Chat App</h1>
                {isLoaded(auth) && isEmpty(auth) ?
                    <ul>
                        <Link to={SIGN_UP_URL}><li>Sign Up</li></Link>
                        <Link to={SIGN_IN_URL}><li>Sign In</li></Link>
                    </ul>
                    :
                    <ul>
                        <Link to={CHAT_URL}><li>Chat</li></Link>

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
)(Home)
