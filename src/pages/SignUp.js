import React, {Component} from 'react';
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {withFirestore} from "react-redux-firebase";
import {signUpWithEmail} from "../utils/firebaseFunctions";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'test@test.com',
            password: 'Password123',
            error: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }


    async handleSubmit(event) {
        event.preventDefault();
        this.setState({error: ''})

        await signUpWithEmail(
            this.props.firebase,
            this.state.email,
            this.state.password,
        ).then(res => {
            this.props.history.push('/')
        }).catch(err => {

            this.setState({error: err})
        })


    }


    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <form onSubmit={this.handleSubmit}>

                    <label htmlFor={"email"}>Email address:</label>
                    <input type="email" id={'email'}
                           value={this.state.email}
                           onChange={e => {
                               this.setState({email: e.target.value})
                           }}
                    />
                    <br/>

                    <label htmlFor={"password"}>Password:</label>
                    <input type="password" id={'password'}
                           value={this.state.password}
                           onChange={e => {
                               this.setState({password: e.target.value})
                           }}
                    />
                    <br/>

                    <input type="submit" value="Sign up"/>

                    {this.state.error ?
                        <div>{this.state.error.message}</div>
                        :
                        null
                    }

                </form>
            </div>
        );
    }
}

export default compose(
    withRouter,
    withFirestore,
)(SignUp)