import React, {Component} from 'react';
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import { isEmpty, isLoaded, firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {SIGN_IN_URL} from "../urlPaths";
import {sendMessage, uploadAttachment} from "../firebaseFunctions";


const MessageComponent = ({sender, userId, children}) => {
    if (sender === userId) {
        return (
            <div style={{left: '12rem', position: 'relative'}}>
                {children}
            </div>
        )
    } else {
        return (
            <div>
                {children}
            </div>
        )
    }
}


class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
            files: {
                length: 0
            },
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
                                        console.log(e)
                                        switch (e.type) {
                                            case 'text': {
                                                return (
                                                    <MessageComponent key={i} sender={e.user} userId={auth.uid}>
                                                        {e.message}
                                                    </MessageComponent>
                                                )
                                            }
                                            case 'attachment': {
                                                return (
                                                    <div key={i} >
                                                        {Object.values(e.attachments).map((a, ai) => {
                                                            return (<MessageComponent key={ai} sender={e.user} userId={auth.uid} >
                                                                {a.contentType.split('/')[0] === 'image' ?
                                                                    <img src={a.url} alt="image" height={100}
                                                                         style={{display: 'block'}}/>
                                                                    :
                                                                    <a href={a.url}
                                                                       target="_blank"><span>{a.name}</span></a>
                                                                }
                                                            </MessageComponent>)
                                                        })}
                                                    </div>
                                                )
                                            }

                                            default:
                                                return null
                                        }

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
                            <input type="file" id="file" multiple={true}
                                   onChange={e => {
                                       this.setState({files: e.target.files})
                                   }}
                            />
                            <button onClick={async () => {
                                await uploadAttachment(
                                    this.props.firebase,
                                    this.state.files,
                                    auth.uid,
                                )
                            }} disabled={this.state.files.length === 0}>
                                Upload files
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
