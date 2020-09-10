import React, {Component} from 'react';
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import {isEmpty, isLoaded, firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {SIGN_IN_URL} from "../urlPaths";
import {sendMessage, sendVipMessage} from "../utils/firebaseFunctions";
import MessageComponent from "../components/MessageComponent";


class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
            conversation: [],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.sentMessages && this.props.receivedMessages) {
            if (
                this.props.sentMessages !== prevProps.sentMessages ||
                this.props.receivedMessages !== prevProps.receivedMessages
            ) {
                let conv = [...Object.values(this.props.sentMessages), ...Object.values(this.props.receivedMessages)]
                    .sort((a, b) => new Date(a.date_created) - new Date(b.date_created))
                this.setState({conversation: conv})
            }
        }
    }

    render() {
        console.log(this.props)
        console.log(this.state)
        const {auth, profile} = this.props
        if (isLoaded(auth)) {
            if (isEmpty(auth)) {
                return <Redirect to={SIGN_IN_URL}/>
            } else {
                return (
                    <div>
                        <h1>Chat</h1>

                        <div>
                            {this.state.conversation ?
                                <div>
                                    {this.state.conversation.map((e, i) => {
                                        return (
                                            <MessageComponent key={i} currentUserId={auth.uid} senderId={e.user}>
                                                {e.text}
                                            </MessageComponent>
                                        )
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
                                    this.props.match.params.userId
                                )
                                await this.setState({message: ''})
                            }}>Send
                            </button>


                            {profile.role === 'admin' ?
                                <button onClick={async () => {
                                    await sendVipMessage(
                                        this.props.firebase,
                                        this.state.message,
                                        auth.uid,
                                    )
                                    await this.setState({message: ''})
                                }}>Send VIP
                                </button>
                                :
                                null
                            }


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
        return [
            {
                path: 'users/' + props.match.params.userId + '/chats',
                queryParams: [
                    'orderByChild=user',
                    `equalTo=${props.auth.uid}`
                ],
                storeAs: 'sentMessages'
            },
            {
                path: 'users/' + props.auth.uid + '/chats',
                queryParams: [
                    'orderByChild=user',
                    `equalTo=${props.match.params.userId}`

                ],
                storeAs: 'receivedMessages'
            }
        ]

    }),
    connect((state) => ({
        sentMessages: state.firebase.data.sentMessages,
        receivedMessages: state.firebase.data.receivedMessages,
    }))
)(Chat)
