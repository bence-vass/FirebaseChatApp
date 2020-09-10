import React, {Component} from 'react';
import {signInWithEmail} from "../utils/firebaseFunctions";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {withFirestore} from "react-redux-firebase";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'test@test.com',
            password: 'Password123',
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(event) {
        console.log(this.state)
        console.log(this.props)
        event.preventDefault();

        await signInWithEmail(
            this.props.firebase,
            this.state.email,
            this.state.password,
        ).then(res => {

            console.log('res')
            console.log(res)
            this.props.history.push('/')

        }).catch(err => {
            console.log('err')
            console.log(err)
        })


    }


    render() {
        return (
            <div>
                <h1>Sign In</h1>
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

                    <input type="submit" value="Sign In"/>
                </form>
            </div>
        );
    }
}

export default compose(
    withRouter,
    withFirestore,
)(SignIn)