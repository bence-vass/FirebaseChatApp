import React, {Component} from 'react';


const sentMessageStyle = {
    margin: '1rem',
    padding: '1rem',
    color: '#ffffff',
    backgroundColor: '#4287f5',
    width: '60%',
    float: 'right',
}

const receivedMessageStyle = {
    margin: '1rem',
    padding: '1rem',
    color: '#343434',
    backgroundColor: '#e9e6d2',
    width: '60%',
    float: 'left',
}

class MessageComponent extends Component {
    render() {
        if(this.props.currentUserId === this.props.senderId){
            return (
                <div style={sentMessageStyle}>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div style={receivedMessageStyle}>
                    {this.props.children}
                </div>
            );
        }

    }
}

export default MessageComponent;