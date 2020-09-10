import React, {Component} from 'react';
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import { isEmpty, isLoaded, firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {SIGN_IN_URL} from "../urlPaths";
import {sendMessage} from "../utils/firebaseFunctions";


class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: '',

        }
    }

    render() {
        console.log(this.props)
        console.log(this.state)
        const {auth, chat} = this.props
        if (isLoaded(auth)) {
            if (isEmpty(auth)) {
                return <Redirect to={SIGN_IN_URL}/>
            } else {
                return (
                    <div>
                        <h1>Chat</h1>
                        <h2>User: {auth.email}</h2>

                        <div>
                            {!isEmpty(chat) ?
                                <div>
                                    {Object.values(chat).map((e, i) => {
                                        console.log(e,i)

                                    })}
                                </div>
                                :
                                <div>Write a message first</div>
                            }
                        </div>

                        <div>
                             <textarea id={"message"} cols="30" rows="10"
                                       value={this.state.message}
                                       onChange={e => {
                                           this.setState({message: e.target.value})
                                       }}
                             />
                            <button onClick={async () => {
                                await sendMessage(
                                    this.props.firebase,
                                    this.state.message,
                                    auth.uid,
                                    this.props.match.params.id
                                )
                                await this.setState({message: ''})
                            }}>Send
                            </button>


                        </div>

                    </div>
                );
            }
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
    firebaseConnect(props => {
        console.log(props)
        return [
            {
                path: 'chatRooms/messages',
                queryParams: [
                    'orderByChild=date',

                ],
                storeAs: 'chat'
            }
        ]

    }),
    connect((state) => ({
        chat: state.firebase.data.chat
    }))
)(Chat)
